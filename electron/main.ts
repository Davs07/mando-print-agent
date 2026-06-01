import { app, BrowserWindow, ipcMain, shell } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import type { AgentStatusEvent, JobEvent, JobResultEvent } from './ipc-types'

// ─── Rutas ────────────────────────────────────────────────────────────────────

function getEnvPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.join(app.getAppPath(), '.env')
}

// ─── Estado del agente ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let agent: any = null
let mainWindow: BrowserWindow | null = null

// ─── Ventana principal ────────────────────────────────────────────────────────

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 920,
    height: 640,
    minWidth: 780,
    minHeight: 520,
    title: 'Mando Print Agent',
    backgroundColor: '#030712',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// ─── Ciclo de vida del agente ─────────────────────────────────────────────────

async function startAgent(): Promise<void> {
  if (agent) {
    try {
      agent.disconnect()
    } catch {
      // ignore
    }
    agent = null
  }

  const envPath = getEnvPath()
  dotenv.config({ path: envPath, override: true })

  try {
    // Lazy-require so dotenv is already loaded when the modules evaluate
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { loadConfig } = require('../src/config') as typeof import('../src/config')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createPrinter } = require('../src/printer') as typeof import('../src/printer')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrintAgent } = require('../src/agent') as typeof import('../src/agent')

    const config = loadConfig(envPath)
    const printer = await createPrinter(config)
    agent = new PrintAgent(config, printer)

    agent.on('status', (event: AgentStatusEvent) => {
      mainWindow?.webContents.send('agent:status', event)
    })
    agent.on('job', (event: JobEvent) => {
      mainWindow?.webContents.send('agent:job', event)
    })
    agent.on('result', (event: JobResultEvent) => {
      mainWindow?.webContents.send('agent:result', event)
    })

    agent.connect()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    mainWindow?.webContents.send('agent:status', { status: 'error', message } satisfies AgentStatusEvent)
  }
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('config:load', (): Record<string, string> | null => {
  const envPath = getEnvPath()
  if (!fs.existsSync(envPath)) return null

  const parsed = dotenv.parse(fs.readFileSync(envPath, 'utf-8'))
  return parsed
})

ipcMain.handle('config:save', (_e, envVars: Record<string, string>): { ok: boolean; error?: string } => {
  try {
    const envPath = getEnvPath()

    // Bootstrap from .env.example if no .env yet
    if (!fs.existsSync(envPath)) {
      const examplePath = path.join(app.getAppPath(), '.env.example')
      if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, envPath)
      }
    }

    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : ''

    for (const [key, value] of Object.entries(envVars)) {
      const regex = new RegExp(`^${key}=.*$`, 'm')
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`)
      } else {
        content += `\n${key}=${value}`
      }
    }

    fs.writeFileSync(envPath, content.trimEnd() + '\n', 'utf-8')
    dotenv.config({ path: envPath, override: true })

    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
})

ipcMain.handle('agent:restart', async (): Promise<void> => {
  await startAgent()
})

ipcMain.handle('app:open-env', (): void => {
  void shell.openPath(getEnvPath())
})

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow()

  mainWindow!.webContents.once('did-finish-load', () => {
    void startAgent()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (agent) {
    try { agent.disconnect() } catch { /* ignore */ }
  }
  if (process.platform !== 'darwin') app.quit()
})
