import { loadConfig } from './config'
import { createPrinter } from './printer'
import { PrintAgent } from './agent'

const BANNER = `
╔══════════════════════════════════════════╗
║        Mando Print Agent  v1.0.0         ║
║  Agente local de impresión térmica ESC/POS ║
╚══════════════════════════════════════════╝
`

async function main(): Promise<void> {
  console.log(BANNER)

  // ─── Cargar configuración ────────────────────────────────────────────────
  let config: ReturnType<typeof loadConfig>
  try {
    config = loadConfig()
  } catch (err) {
    console.error(
      '[ERROR] Configuración inválida:',
      err instanceof Error ? err.message : err,
    )
    process.exit(1)
  }

  console.log(`[INFO ] Backend    : ${config.backendUrl}`)
  console.log(`[INFO ] Impresora  : ${config.printerType}`)
  if (config.printerType === 'network') {
    console.log(`[INFO ] Dirección  : ${config.printerHost}:${config.printerPort}`)
  } else if (config.printerType === 'serial') {
    console.log(`[INFO ] Puerto     : ${config.serialPath} @ ${config.serialBaudRate} baud`)
  } else if (config.printerType === 'file') {
    console.log(`[INFO ] Archivo    : ${config.filePath}`)
  }
  console.log(`[INFO ] Papel      : ${config.paperWidth}`)
  console.log(`[INFO ] Heartbeat  : cada ${config.heartbeatIntervalMs / 1000}s`)
  console.log('')

  // ─── Inicializar impresora ────────────────────────────────────────────────
  let printer: Awaited<ReturnType<typeof createPrinter>>
  try {
    printer = await createPrinter(config)
    console.log('[INFO ] Impresora inicializada correctamente.')
  } catch (err) {
    console.error(
      '[ERROR] No se pudo inicializar la impresora:',
      err instanceof Error ? err.message : err,
    )
    process.exit(1)
  }

  // ─── Conectar al backend ──────────────────────────────────────────────────
  const agent = new PrintAgent(config, printer)
  agent.connect()

  // ─── Apagado gracioso ─────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    console.log(`\n[INFO ] Señal ${signal} recibida — apagando...`)
    agent.disconnect()
    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  // Mantener el proceso vivo (el socket.io-client no lo hace por sí solo en todos los entornos)
  // El setInterval actúa como "keep-alive" trivial; el timer de heartbeat es el real.
  setInterval(() => {
    // no-op keep-alive
  }, 60_000)
}

main()
