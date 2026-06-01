import type { AgentStatusEvent, JobEvent, JobResultEvent } from '../electron/ipc-types'

declare global {
  interface Window {
    api: {
      onAgentStatus: (cb: (e: AgentStatusEvent) => void) => () => void
      onAgentJob: (cb: (e: JobEvent) => void) => () => void
      onAgentResult: (cb: (e: JobResultEvent) => void) => () => void
      loadConfig: () => Promise<Record<string, string> | null>
      saveConfig: (data: Record<string, string>) => Promise<{ ok: boolean; error?: string }>
      restartAgent: () => Promise<void>
      openEnvFile: () => Promise<void>
    }
  }
}

export {}
