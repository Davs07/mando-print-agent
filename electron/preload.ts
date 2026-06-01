import { contextBridge, ipcRenderer } from 'electron'
import type { AgentStatusEvent, JobEvent, JobResultEvent } from './ipc-types'

contextBridge.exposeInMainWorld('api', {
  onAgentStatus: (cb: (e: AgentStatusEvent) => void): (() => void) => {
    const handler = (_: Electron.IpcRendererEvent, e: AgentStatusEvent) => cb(e)
    ipcRenderer.on('agent:status', handler)
    return () => ipcRenderer.removeListener('agent:status', handler)
  },

  onAgentJob: (cb: (e: JobEvent) => void): (() => void) => {
    const handler = (_: Electron.IpcRendererEvent, e: JobEvent) => cb(e)
    ipcRenderer.on('agent:job', handler)
    return () => ipcRenderer.removeListener('agent:job', handler)
  },

  onAgentResult: (cb: (e: JobResultEvent) => void): (() => void) => {
    const handler = (_: Electron.IpcRendererEvent, e: JobResultEvent) => cb(e)
    ipcRenderer.on('agent:result', handler)
    return () => ipcRenderer.removeListener('agent:result', handler)
  },

  loadConfig: (): Promise<Record<string, string> | null> =>
    ipcRenderer.invoke('config:load'),

  saveConfig: (data: Record<string, string>): Promise<{ ok: boolean; error?: string }> =>
    ipcRenderer.invoke('config:save', data),

  restartAgent: (): Promise<void> =>
    ipcRenderer.invoke('agent:restart'),

  openEnvFile: (): Promise<void> =>
    ipcRenderer.invoke('app:open-env'),
})
