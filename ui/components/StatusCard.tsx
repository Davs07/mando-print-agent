import type { AgentStatusEvent } from '../../electron/ipc-types'

const STATUS_CONFIG = {
  connecting: { dot: 'bg-yellow-400 animate-pulse', label: 'Conectando...', text: 'text-yellow-400' },
  connected:  { dot: 'bg-green-400',                label: 'Conectado',     text: 'text-green-400'  },
  disconnected:{ dot: 'bg-gray-500',                label: 'Desconectado',  text: 'text-gray-400'   },
  error:      { dot: 'bg-red-500',                  label: 'Error',         text: 'text-red-400'    },
} as const

interface Props {
  status: AgentStatusEvent
}

export default function StatusCard({ status }: Props) {
  const cfg = STATUS_CONFIG[status.status]
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
      <span className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</span>
      {status.message && (
        <span className="text-xs text-gray-500 truncate max-w-xs" title={status.message}>
          {status.message}
        </span>
      )}
    </div>
  )
}
