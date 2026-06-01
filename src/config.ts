import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Cargar .env desde el directorio de trabajo o el directorio del binario
const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '..', '.env'),
]
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    break
  }
}

export type PrinterType = 'network' | 'serial' | 'file'
export type PaperWidth = '58mm' | '80mm'
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface PrintAgentConfig {
  token: string
  backendUrl: string
  printerType: PrinterType
  /** network */
  printerHost?: string
  printerPort: number
  /** serial */
  serialPath?: string
  serialBaudRate: number
  /** file */
  filePath?: string
  heartbeatIntervalMs: number
  paperWidth: PaperWidth
  logLevel: LogLevel
}

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    throw new Error(`Variable de entorno requerida: ${key} (ver .env.example)`)
  }
  return val
}

function parseIntEnv(key: string, defaultValue: number): number {
  const val = process.env[key]
  if (!val) return defaultValue
  const parsed = parseInt(val, 10)
  if (isNaN(parsed)) {
    throw new Error(`${key} debe ser un número entero (recibido: "${val}")`)
  }
  return parsed
}

export function loadConfig(): PrintAgentConfig {
  const printerType = (process.env.PRINTER_TYPE ?? 'network') as PrinterType
  if (!['network', 'serial', 'file'].includes(printerType)) {
    throw new Error(`PRINTER_TYPE inválido: "${printerType}". Opciones: network | serial | file`)
  }

  const paperWidth = (process.env.PAPER_WIDTH ?? '80mm') as PaperWidth
  if (!['58mm', '80mm'].includes(paperWidth)) {
    throw new Error(`PAPER_WIDTH inválido: "${paperWidth}". Opciones: 58mm | 80mm`)
  }

  const logLevel = (process.env.LOG_LEVEL ?? 'info') as LogLevel
  if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
    throw new Error(`LOG_LEVEL inválido: "${logLevel}". Opciones: debug | info | warn | error`)
  }

  return {
    token: requireEnv('MANDO_AGENT_TOKEN'),
    backendUrl: requireEnv('MANDO_BACKEND_URL').replace(/\/$/, ''),
    printerType,
    printerHost: process.env.PRINTER_HOST,
    printerPort: parseIntEnv('PRINTER_PORT', 9100),
    serialPath: process.env.SERIAL_PATH,
    serialBaudRate: parseIntEnv('SERIAL_BAUD_RATE', 9600),
    filePath: process.env.PRINTER_FILE_PATH,
    heartbeatIntervalMs: parseIntEnv('HEARTBEAT_INTERVAL_MS', 25000),
    paperWidth,
    logLevel,
  }
}
