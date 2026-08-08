import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Backend de producción.
 *
 * ⚠️ Es el valor que usa una instalación nueva si nadie toca `MANDO_BACKEND_URL`,
 * así que tiene que ser el dominio de producción. Antes apuntaba al host de
 * Render (`mandobusiness-backend-nest.onrender.com`), que es el entorno viejo:
 * cada local recién instalado hablaba con el backend equivocado sin que nada
 * fallara de forma visible — simplemente el token no validaba.
 */
const DEFAULT_BACKEND_URL = 'https://api.mando.uno'

function loadDotenv(customPath?: string): void {
  if (customPath) {
    dotenv.config({ path: customPath, override: true })
    return
  }
  // Auto-discover .env desde el directorio de trabajo o el directorio del binario
  const searchPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env'),
  ]
  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p })
      break
    }
  }
}

export type PrinterType = 'network' | 'serial' | 'windows' | 'file'
export type PaperWidth = '58mm' | '80mm'
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export const TIPOS_DE_IMPRESORA: PrinterType[] = ['network', 'serial', 'windows', 'file']

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
  /** windows — nombre exacto en «Dispositivos e impresoras» */
  printerName?: string
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

export function loadConfig(envPath?: string): PrintAgentConfig {
  loadDotenv(envPath)

  const printerType = (process.env.PRINTER_TYPE ?? 'network') as PrinterType
  if (!TIPOS_DE_IMPRESORA.includes(printerType)) {
    throw new Error(
      `PRINTER_TYPE inválido: "${printerType}". Opciones: ${TIPOS_DE_IMPRESORA.join(' | ')}`,
    )
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
    backendUrl: (process.env.MANDO_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, ''),
    printerType,
    printerHost: process.env.PRINTER_HOST,
    printerPort: parseIntEnv('PRINTER_PORT', 9100),
    serialPath: process.env.SERIAL_PATH,
    serialBaudRate: parseIntEnv('SERIAL_BAUD_RATE', 9600),
    printerName: process.env.PRINTER_NAME,
    filePath: process.env.PRINTER_FILE_PATH,
    heartbeatIntervalMs: parseIntEnv('HEARTBEAT_INTERVAL_MS', 25000),
    paperWidth,
    logLevel,
  }
}
