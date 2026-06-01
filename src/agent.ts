import { EventEmitter } from 'events'
import { io, Socket } from 'socket.io-client'
import { encodeReceiptTicket, encodeKitchenTicket } from './escpos'
import type { PrintAgentConfig, LogLevel } from './config'
import type { Printer } from './printer'

// ─── Tipos espejados del backend ──────────────────────────────────────────────

interface PrintBranding {
  businessName: string
  businessAddress: string
  businessPhone: string
  businessDocument: string
  businessLogoUrl: string
  receiptPrimaryColor: string
  receiptShowLogo: boolean
  receiptShowCustomerName: boolean
  receiptShowItemNotes: boolean
  receiptShowOrderNotes: boolean
  receiptHeaderText: string
  receiptFooterText: string
  kitchenShowLogo: boolean
  kitchenShowCustomerName: boolean
  kitchenShowTableName: boolean
  kitchenShowItemNotes: boolean
  kitchenHeaderText: string
  kitchenFooterText: string
}

interface PrintJobPayload {
  jobId: string
  businessId: string
  agentId: string
  orderId: string
  ticketType: 'RECEIPT' | 'KITCHEN'
  paperWidth: '58mm' | '80mm'
  order: Record<string, unknown>
  branding: PrintBranding
  timestamp: string
}

interface PrintJobResultPayload {
  jobId: string
  orderId?: string
  ticketType?: string
  success: boolean
  error?: string
}

// ─── Implementación del agente ────────────────────────────────────────────────

export class PrintAgent extends EventEmitter {
  private socket: Socket | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private readonly logLevelIndex: number

  private static readonly LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error']

  constructor(
    private readonly config: PrintAgentConfig,
    private readonly printer: Printer,
  ) {
    super()
    this.logLevelIndex = PrintAgent.LOG_LEVELS.indexOf(config.logLevel)
  }

  connect(): void {
    const url = this.config.backendUrl
    this.log('info', `Conectando a ${url}/print-agent ...`)
    this.emit('status', { status: 'connecting', message: `Conectando a ${url}` })

    this.socket = io(`${url}/print-agent`, {
      query: { token: this.config.token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30_000,
      reconnectionAttempts: Infinity,
    })

    this.socket.on('connect', () => {
      this.log('info', `Conectado. Socket ID: ${this.socket!.id}`)
      this.emit('status', { status: 'connected', message: `Socket ID: ${this.socket!.id}` })
      this.startHeartbeat()
    })

    this.socket.on('disconnect', (reason) => {
      this.log('warn', `Desconectado: ${reason}`)
      this.emit('status', { status: 'disconnected', message: reason })
      this.stopHeartbeat()
    })

    this.socket.on('connect_error', (err) => {
      this.log('error', `Error de conexión: ${err.message}`)
      this.emit('status', { status: 'error', message: err.message })
    })

    this.socket.on('reconnect_attempt', (attempt) => {
      this.log('info', `Reconectando (intento ${attempt})...`)
      this.emit('status', { status: 'connecting', message: `Reconectando (intento ${attempt})` })
    })

    this.socket.on('print:job', (payload: PrintJobPayload) => {
      this.handlePrintJob(payload).catch((err) => {
        this.log('error', `Error no capturado en handlePrintJob: ${err}`)
      })
    })
  }

  disconnect(): void {
    this.stopHeartbeat()
    this.socket?.disconnect()
    this.socket = null
    this.log('info', 'Desconectado del servidor.')
  }

  // ─── Heartbeat ──────────────────────────────────────────────────────────────

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (!this.socket?.connected) return
      this.socket.emit('agent:heartbeat', {}, (response: unknown) => {
        this.log('debug', `Heartbeat ack: ${JSON.stringify(response)}`)
      })
    }, this.config.heartbeatIntervalMs)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // ─── Impresión ──────────────────────────────────────────────────────────────

  private async handlePrintJob(payload: PrintJobPayload): Promise<void> {
    const { jobId, ticketType, paperWidth, order, branding, orderId } = payload
    this.log(
      'info',
      `Job recibido: ${jobId} | tipo: ${ticketType} | papel: ${paperWidth}`,
    )
    this.emit('job', { jobId, orderId, ticketType, timestamp: payload.timestamp })

    let success = false
    let error: string | undefined

    try {
      const effectivePaperWidth = paperWidth ?? this.config.paperWidth

      const bytes =
        ticketType === 'RECEIPT'
          ? encodeReceiptTicket(order, effectivePaperWidth, branding)
          : encodeKitchenTicket(order, effectivePaperWidth, branding)

      await this.printer.print(bytes)
      success = true
      this.log('info', `Job ${jobId} impreso correctamente`)
    } catch (err) {
      error = err instanceof Error ? err.message : String(err)
      this.log('error', `Job ${jobId} falló: ${error}`)
    }

    const result: PrintJobResultPayload = {
      jobId,
      orderId,
      ticketType,
      success,
      ...(error ? { error } : {}),
    }

    this.emit('result', { jobId, success, ...(error ? { error } : {}) })
    this.socket?.emit('print:result', result)
  }

  // ─── Logger ─────────────────────────────────────────────────────────────────

  private log(level: LogLevel, message: string): void {
    const idx = PrintAgent.LOG_LEVELS.indexOf(level)
    if (idx < this.logLevelIndex) return

    const ts = new Date().toISOString()
    const prefix: Record<LogLevel, string> = {
      debug: '[DEBUG]',
      info: '[INFO ]',
      warn: '[WARN ]',
      error: '[ERROR]',
    }
    // eslint-disable-next-line no-console
    console.log(`${ts} ${prefix[level]} ${message}`)
  }
}
