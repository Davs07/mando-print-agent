// Tipos compartidos entre main, preload y renderer (sin dependencias Node.js)

export interface AgentStatusEvent {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  message?: string
}

export interface JobEvent {
  jobId: string
  orderId: string
  /** Puede llegar un tipo que esta version no conoce: se rechaza y se muestra tal cual. */
  ticketType: 'RECEIPT' | 'KITCHEN' | 'CASH_CLOSE' | 'ELECTRONIC' | (string & {})
  /** Con `RECEIPT`: es una precuenta, no un comprobante. */
  preventa?: boolean
  /** Con `CASH_CLOSE`: `orderId` va vacio y la referencia es la caja. */
  cashBoxId?: string
  /** Con `ELECTRONIC`: solo el tipo de documento (`"03"` boleta, `"01"` factura). */
  fiscal?: { tipoDoc: string }
  timestamp: string
}

export interface JobResultEvent {
  jobId: string
  success: boolean
  error?: string
}

export interface ConfigData {
  MANDO_AGENT_TOKEN: string
  MANDO_BACKEND_URL: string
  PRINTER_TYPE: 'network' | 'serial' | 'windows' | 'file'
  PRINTER_HOST?: string
  PRINTER_PORT?: string
  SERIAL_PATH?: string
  SERIAL_BAUD_RATE?: string
  /** Nombre exacto de la impresora instalada en Windows. */
  PRINTER_NAME?: string
  PRINTER_FILE_PATH?: string
  HEARTBEAT_INTERVAL_MS?: string
  PAPER_WIDTH?: '58mm' | '80mm'
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'
}
