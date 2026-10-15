import { EventEmitter } from 'events'
import { io, Socket } from 'socket.io-client'
import { encodeReceiptTicket, encodeKitchenTicket, encodeCashCloseTicket, encodeElectronicTicket } from './escpos'
import type { PrintAgentConfig, LogLevel } from './config'
import type { Printer } from './printer'
import pkg from '../package.json'

/**
 * Version del agente tal como la declara `package.json`: es el mismo dato que
 * usa electron-builder para nombrar el instalador y `app.getVersion()` para la
 * ventana, asi que la API ve lo mismo que ve el usuario.
 */
export const VERSION_AGENTE: string = pkg.version

/**
 * Lo que este agente sabe imprimir ademas de comandas y comprobantes.
 *
 * POR QUE SE DECLARA: la API solo manda precuentas, cierres de caja y boletas o
 * facturas electronicas a quien lo diga. Un agente viejo que recibiera una precuenta la imprimiria como
 * comprobante, sin el aviso de que no es un comprobante de pago. Agregar una
 * capacidad aqui sin implementarla en `handlePrintJob` seria mentirle a la API.
 */
export const CAPACIDADES_AGENTE = ['PREVENTA', 'CASH_CLOSE', 'ELECTRONICO'] as const

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
  /** Vacio (`""`) en un `CASH_CLOSE`: no hay pedido, hay una caja. */
  orderId: string
  /**
   * `string` a proposito y no la union cerrada: lo que llega por el socket no lo
   * controla este agente, y un tipo que no conoce debe rechazarse, no caer en la
   * rama por defecto.
   */
  ticketType: 'RECEIPT' | 'KITCHEN' | 'CASH_CLOSE' | 'ELECTRONIC' | (string & {})
  paperWidth: '58mm' | '80mm'
  /** `{}` en un `CASH_CLOSE`. */
  order: Record<string, unknown>
  /** Solo con `RECEIPT`: sale la precuenta, no el comprobante. */
  preventa?: boolean
  /** Solo con `CASH_CLOSE`, con la forma de `CashCloseData`. */
  cashClose?: Record<string, unknown>
  cashBoxId?: string
  /**
   * Solo con `ELECTRONIC`: los datos de la boleta o factura emitida, con la
   * forma de `DatosFiscales` (`order` trae el pedido, igual que en `RECEIPT`).
   */
  fiscal?: Record<string, unknown>
  branding: PrintBranding
  timestamp: string
}

interface PrintJobResultPayload {
  jobId: string
  orderId?: string
  ticketType?: string
  cashBoxId?: string
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
      /**
       * EL TOKEN VA EN `auth`, NO EN `query`.
       *
       * El gateway del backend (print-agent.gateway.ts, extractToken) solo mira
       * `handshake.auth.token` y la cabecera `Authorization: Bearer`. Nunca lee
       * `handshake.query`, asi que mandarlo ahi hacia que extractToken
       * devolviera null, el gateway lanzara UnauthorizedException y cortara con
       * `client.disconnect(true)`.
       *
       * El sintoma engañaba: el socket SI conectaba y el servidor lo echaba
       * medio segundo despues, asi que la app mostraba "Desconectado" en gris
       * (evento disconnect) en vez de "Error" en rojo (connect_error). Parecia
       * un problema de red o de firewall, y era de autenticacion.
       */
      auth: {
        token: this.config.token,
        version: VERSION_AGENTE,
        capacidades: [...CAPACIDADES_AGENTE],
      },
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
    const { jobId, ticketType, paperWidth, order, branding, orderId, preventa, cashClose, cashBoxId, fiscal } = payload
    this.log(
      'info',
      `Job recibido: ${jobId} | tipo: ${ticketType}${preventa ? ' (precuenta)' : ''} | papel: ${paperWidth}`,
    )
    this.emit('job', {
      jobId,
      orderId,
      ticketType,
      timestamp: payload.timestamp,
      ...(preventa ? { preventa: true } : {}),
      ...(cashBoxId ? { cashBoxId } : {}),
      // Solo el tipo de documento, para que la interfaz diga «Boleta» o «Factura»
      // sin cargar con el comprobante entero (cliente, importes) hasta la ventana.
      ...(ticketType === 'ELECTRONIC' && fiscal && typeof fiscal === 'object'
        ? { fiscal: { tipoDoc: String(fiscal.tipoDoc ?? '') } }
        : {}),
    })

    let success = false
    let error: string | undefined

    try {
      const effectivePaperWidth = paperWidth ?? this.config.paperWidth

      let bytes: Uint8Array
      switch (ticketType) {
        case 'RECEIPT':
          bytes = encodeReceiptTicket(order, effectivePaperWidth, branding, { preventa })
          break
        case 'KITCHEN':
          bytes = encodeKitchenTicket(order, effectivePaperWidth, branding)
          break
        case 'CASH_CLOSE':
          if (!cashClose || typeof cashClose !== 'object') {
            throw new Error('El cierre de caja llego sin datos (cashClose)')
          }
          bytes = encodeCashCloseTicket(cashClose, effectivePaperWidth, branding)
          break
        case 'ELECTRONIC':
          bytes = encodeElectronicTicket(order, fiscal, effectivePaperWidth, branding)
          break
        default:
          // Nunca caer en la comanda: imprimir en cocina un documento que el
          // agente no entiende es peor que no imprimir, y la API ve el error.
          throw new Error(`Tipo de ticket desconocido: ${String(ticketType)}`)
      }

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
      ...(cashBoxId ? { cashBoxId } : {}),
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
