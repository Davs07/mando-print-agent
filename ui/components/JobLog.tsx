import type { JobEvent } from '../../electron/ipc-types'

interface JobEntry extends JobEvent {
  success?: boolean
  error?: string
}

interface Props {
  jobs: JobEntry[]
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return iso
  }
}

export default function JobLog({ jobs }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-gray-800 shrink-0 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Log de trabajos</h2>
        <span className="text-xs text-gray-600">{jobs.length} trabajos</span>
      </div>

      {jobs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
          Esperando trabajos de impresión...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60">
          {jobs.map((job) => (
            <div key={job.jobId} className="flex items-start gap-3 px-5 py-2.5 hover:bg-gray-900/50 transition-colors">
              {/* Status indicator */}
              <div className="pt-0.5 shrink-0">
                {job.success === undefined ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse mt-1" />
                ) : job.success ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 mt-1" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-500">{formatTime(job.timestamp)}</span>
                  <span className="text-sm text-gray-200 font-medium truncate">#{job.orderId}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      job.ticketType === 'RECEIPT'
                        ? 'bg-blue-900/60 text-blue-300'
                        : 'bg-orange-900/60 text-orange-300'
                    }`}
                  >
                    {job.ticketType === 'RECEIPT' ? 'Recibo' : 'Cocina'}
                  </span>
                  {job.success === true && (
                    <span className="text-xs text-green-400">✓ OK</span>
                  )}
                  {job.success === false && (
                    <span className="text-xs text-red-400">✗ Error</span>
                  )}
                </div>
                {job.error && (
                  <p className="text-xs text-red-400/80 mt-0.5 truncate" title={job.error}>
                    {job.error}
                  </p>
                )}
              </div>

              {/* Job ID */}
              <span className="text-xs text-gray-700 font-mono shrink-0 hidden xl:block truncate max-w-32" title={job.jobId}>
                {job.jobId}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
