import { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
/**
 * ⚠️ Estos tres se importan de forma estática A PROPÓSITO.
 *
 * Antes se cargaban con `require('../src/…')` dentro de `startAgent`, con la
 * idea de que dotenv estuviera listo antes de evaluarlos. No hace falta:
 * ninguno lee `process.env` al importarse — `config.ts` lo hace dentro de
 * `loadConfig()`, y `printer.ts` y `agent.ts` solo al construirse.
 *
 * Y el `require` tenía un coste grave: rollup lo dejaba como externo, así que
 * en la app empaquetada resolvía a `out/src/config` —una ruta que no existe— y
 * encima `electron-builder` excluye `src/**`. Importándolos de verdad, entran
 * en el bundle.
 */
import { loadConfig } from '../src/config'
import { createPrinter } from '../src/printer'
import { encodeTestTicket } from '../src/escpos'
import { PrintAgent } from '../src/agent'
import type { AgentStatusEvent, JobEvent, JobResultEvent } from './ipc-types'

// ─── Rutas ────────────────────────────────────────────────────────────────────

/**
 * Dónde vive el `.env` con el token y los datos de la impresora.
 *
 * ⚠️ Empaquetado va en `userData`, NO en la carpeta del programa. Antes se
 * guardaba en `process.resourcesPath` y eso rompía de dos formas:
 *
 * - La config se **borraba en cada actualización o reinstalación**, porque el
 *   instalador reemplaza esa carpeta entera. El local tenía que volver a
 *   escribir el token y la IP de la impresora cada vez.
 * - Si el usuario cambiaba el directorio de instalación a `Program Files`
 *   (el instalador lo permite: `allowToChangeInstallationDirectory`), escribir
 *   ahí exige permisos de administrador y `config:save` fallaba con `EPERM`,
 *   así que la configuración **no se podía guardar nunca**.
 */
function getEnvPath(): string {
  return app.isPackaged
    ? path.join(app.getPath('userData'), '.env')
    : path.join(app.getAppPath(), '.env')
}

/**
 * La plantilla con los valores por defecto.
 *
 * ⚠️ Empaquetada vive en `process.resourcesPath` porque así la copia
 * `extraResources`. El código anterior la buscaba en `app.getAppPath()`, que
 * empaquetado es `resources/app.asar`: nunca coincidían y el bootstrap de
 * valores por defecto no se ejecutaba jamás.
 */
function getExamplePath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, '.env.example')
    : path.join(app.getAppPath(), '.env.example')
}

/**
 * Rescata la configuración de instalaciones anteriores, que la guardaban dentro
 * de la carpeta del programa. Sin esto, actualizar el agente dejaría al local
 * sin token y sin imprimir hasta que alguien lo reconfigure a mano.
 */
function migrarConfigAntigua(): void {
  if (!app.isPackaged) return

  const destino = getEnvPath()
  if (fs.existsSync(destino)) return

  const origen = path.join(process.resourcesPath, '.env')
  if (!fs.existsSync(origen)) return

  try {
    fs.copyFileSync(origen, destino)
  } catch {
    // Si no se puede migrar se sigue con la config vacía: el usuario la vuelve
    // a introducir, que es el comportamiento que ya había.
  }
}

// ─── Estado del agente ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let agent: any = null
let mainWindow: BrowserWindow | null = null

/**
 * Último estado conocido, para poder leerlo en la bandeja sin abrir la ventana.
 * Es lo único que ve el usuario cuando el agente corre minimizado.
 */
let estadoActual = 'iniciando'

const ETIQUETA_ESTADO: Record<AgentStatusEvent['status'], string> = {
  connecting: 'conectando…',
  connected: 'conectado',
  disconnected: 'desconectado',
  error: 'error',
}

// ─── Ventana principal ────────────────────────────────────────────────────────

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 920,
    height: 640,
    minWidth: 780,
    minHeight: 520,
    // También en la barra de tareas / Alt+Tab, no solo dentro de la ventana.
    title: `Mando Print Agent v${app.getVersion()}`,
    backgroundColor: '#030712',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  /**
   * La X esconde la ventana en vez de destruirla: el agente tiene que seguir
   * imprimiendo. Solo se cierra de verdad cuando se sale desde la bandeja.
   */
  mainWindow.on('close', (evento) => {
    if (saliendoDeVerdad) return
    evento.preventDefault()
    mainWindow?.hide()
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
    const config = loadConfig(envPath)
    const printer = await createPrinter(config)
    agent = new PrintAgent(config, printer)

    agent.on('status', (event: AgentStatusEvent) => {
      estadoActual = ETIQUETA_ESTADO[event.status] ?? event.status
      refrescarMenuBandeja()
      tray?.setToolTip(`Mando Print Agent — ${estadoActual}`)
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
    estadoActual = `error: ${message}`
    refrescarMenuBandeja()
    tray?.setToolTip(`Mando Print Agent — ${estadoActual}`)
    mainWindow?.webContents.send('agent:status', { status: 'error', message } satisfies AgentStatusEvent)
  }
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

/**
 * `app.getVersion()` lee el campo `version` de `package.json` — empaquetado o
 * no, es el mismo dato que usa `electron-builder` para nombrar el instalador.
 * Un solo origen a propósito: el header ya mostraba "v1.0.0" fijo mientras
 * `package.json` iba por 1.1.1, y nadie lo notó porque no había forma de que
 * ese texto fallara al compilar.
 */
ipcMain.handle('app:version', (): string => app.getVersion())

ipcMain.handle('config:load', (): Record<string, string> | null => {
  const envPath = getEnvPath()
  if (!fs.existsSync(envPath)) return null

  const parsed = dotenv.parse(fs.readFileSync(envPath, 'utf-8'))
  return parsed
})

ipcMain.handle('config:save', (_e, envVars: Record<string, string>): { ok: boolean; error?: string } => {
  try {
    const envPath = getEnvPath()

    // Siembra los valores por defecto la primera vez.
    if (!fs.existsSync(envPath)) {
      const examplePath = getExamplePath()
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

/**
 * Imprime un ticket de prueba con la configuracion guardada.
 *
 * Recorre el mismo camino que un ticket real (loadConfig -> createPrinter ->
 * print), asi que si esto sale impreso, las comandas tambien saldran. Antes la
 * unica forma de verificar era esperar un pedido de verdad, y si estaba mal el
 * negocio se enteraba con un cliente delante.
 */
ipcMain.handle('printer:test', async (): Promise<{ ok: boolean; error?: string }> => {
  try {
    const config = loadConfig(getEnvPath())
    const printer = await createPrinter(config)
    await printer.print(encodeTestTicket(config.paperWidth ?? '80mm'))
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
})

ipcMain.handle('app:open-env', (): void => {
  void shell.openPath(getEnvPath())
})

/**
 * Impresoras instaladas en el sistema, para que el formulario ofrezca una lista
 * en vez de pedir el nombre a mano. El modo `windows` exige el nombre **exacto**
 * con el que figura en el sistema, y teclearlo mal es el error más fácil de
 * cometer y el más difícil de diagnosticar: la impresión falla sin más pista.
 */
ipcMain.handle('printers:list', async (): Promise<string[]> => {
  try {
    const impresoras = await mainWindow?.webContents.getPrintersAsync()
    return (impresoras ?? []).map((p) => p.name)
  } catch {
    return []
  }
})

// ─── Bandeja del sistema ──────────────────────────────────────────────────────

let tray: Tray | null = null
/** Solo se sale de verdad desde el menú de la bandeja. */
let saliendoDeVerdad = false

function iconoBandeja(): Electron.NativeImage {
  const candidatos = app.isPackaged
    ? [path.join(process.resourcesPath, 'icon.png')]
    : [path.join(app.getAppPath(), 'build', 'icon.png')]

  for (const ruta of candidatos) {
    if (fs.existsSync(ruta)) {
      const img = nativeImage.createFromPath(ruta)
      if (!img.isEmpty()) return img.resize({ width: 16, height: 16 })
    }
  }
  // Sin icono la bandeja seguiría funcionando pero sería invisible en Windows,
  // que es peor que no tenerla: el usuario no puede ni salir ni reabrir.
  return nativeImage.createEmpty()
}

function mostrarVentana(): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    return
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

function refrescarMenuBandeja(): void {
  if (!tray) return

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: `Estado: ${estadoActual}`, enabled: false },
      { type: 'separator' },
      { label: 'Abrir Mando Print Agent', click: () => mostrarVentana() },
      { label: 'Reiniciar agente', click: () => void startAgent() },
      { type: 'separator' },
      {
        label: 'Iniciar con Windows',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: (item) => {
          app.setLoginItemSettings({ openAtLogin: item.checked, args: ['--oculto'] })
        },
      },
      { type: 'separator' },
      {
        label: 'Salir',
        click: () => {
          saliendoDeVerdad = true
          app.quit()
        },
      },
    ]),
  )
}

function crearBandeja(): void {
  tray = new Tray(iconoBandeja())
  tray.setToolTip('Mando Print Agent')
  tray.on('double-click', () => mostrarVentana())
  refrescarMenuBandeja()
}

// ─── App lifecycle ────────────────────────────────────────────────────────────

/**
 * ⚠️ Dos copias del agente conectadas con el mismo token imprimirían **cada
 * ticket por duplicado**. El bloqueo de instancia única lo impide y, de paso,
 * hace que abrir el acceso directo otra vez muestre la ventana que ya existe.
 */
const tieneElBloqueo = app.requestSingleInstanceLock()

if (!tieneElBloqueo) {
  app.quit()
} else {
  app.on('second-instance', () => mostrarVentana())

  app.whenReady().then(() => {
    migrarConfigAntigua()
    createWindow()
    crearBandeja()

    mainWindow!.webContents.once('did-finish-load', () => {
      void startAgent()
    })

    // Arrancado por el autostart de Windows: el agente trabaja en la bandeja
    // sin robarle la pantalla a nadie.
    if (process.argv.includes('--oculto')) mainWindow?.hide()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
      else mostrarVentana()
    })
  })
}

/**
 * ⚠️ NO se cierra la aplicación al cerrar la ventana.
 *
 * Un agente de impresión que muere cuando cierras la ventana no es un agente:
 * el local dejaría de imprimir en cuanto alguien pulsa la X, sin ningún aviso.
 * La ventana solo es el panel de configuración; el agente vive en la bandeja.
 */
app.on('window-all-closed', () => {
  // Deliberadamente vacío: se sale desde la bandeja.
})

app.on('before-quit', () => {
  saliendoDeVerdad = true
  if (agent) {
    try { agent.disconnect() } catch { /* ignore */ }
  }
})
