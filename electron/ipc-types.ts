// Tipos compartidos entre main, preload y renderer (sin dependencias Node.js)

export interface AgentStatusEvent {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  message?: string
}

export interface JobEvent {
  jobId: string
  orderId: string
  ticketType: 'RECEIPT' | 'KITCHEN'
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
  PRINTER_TYPE: 'network' | 'serial' | 'file'
  PRINTER_HOST?: string
  PRINTER_PORT?: string
  SERIAL_PATH?: string
  SERIAL_BAUD_RATE?: string
  PRINTER_FILE_PATH?: string
  HEARTBEAT_INTERVAL_MS?: string
  PAPER_WIDTH?: '58mm' | '80mm'
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'
}
