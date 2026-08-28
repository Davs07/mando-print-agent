import { useEffect, useState } from 'react'
import StatusCard from './components/StatusCard'
import PrinterConfigForm from './components/PrinterConfigForm'
import JobLog from './components/JobLog'
import type { AgentStatusEvent, JobEvent, JobResultEvent } from '../electron/ipc-types'

interface JobEntry extends JobEvent {
  success?: boolean
  error?: string
}

export default function App() {
  const [status, setStatus] = useState<AgentStatusEvent>({ status: 'connecting' })
  const [jobs, setJobs] = useState<JobEntry[]>([])
  const [config, setConfig] = useState<Record<string, string> | null>(null)
  // `null` mientras carga: no se muestra ningun numero hasta tener el real, en
  // vez de arriesgarse a mostrar uno fijo que se desactualiza sin avisar (era
  // "v1.0.0" a mano mientras el instalador ya iba en 1.1.1).
  const [version, setVersion] = useState<string | null>(null)

  // Load config & subscribe to IPC events
  useEffect(() => {
    void window.api.loadConfig().then(setConfig)
    void window.api.getVersion().then(setVersion)

    const off1 = window.api.onAgentStatus(setStatus)
    const off2 = window.api.onAgentJob((job) => {
      setJobs((prev) => [{ ...job }, ...prev].slice(0, 100))
    })
    const off3 = window.api.onAgentResult((result) => {
      setJobs((prev) =>
        prev.map((j) =>
          j.jobId === result.jobId
            ? { ...j, success: result.success, error: result.error }
            : j,
        ),
      )
    })

    return () => {
      off1()
      off2()
      off3()
    }
  }, [])

  async function handleSave(data: Record<string, string>) {
    const res = await window.api.saveConfig(data)
    if (res.ok) {
      setConfig(data)
      await window.api.restartAgent()
    } else {
      alert(`Error al guardar: ${res.error ?? 'desconocido'}`)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">🖨</span>
          <span className="font-semibold text-white tracking-tight">Mando Print Agent</span>
          {version && <span className="text-xs text-gray-500 font-mono">v{version}</span>}
        </div>
        <StatusCard status={status} />
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — Config */}
        <aside className="w-80 shrink-0 border-r border-gray-800 overflow-y-auto">
          <PrinterConfigForm initial={config} onSave={handleSave} />
        </aside>

        {/* Right panel — Job log */}
        <main className="flex-1 overflow-hidden">
          <JobLog jobs={jobs} />
        </main>
      </div>
    </div>
  )
}
