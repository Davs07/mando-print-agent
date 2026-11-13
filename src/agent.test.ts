/**
 * Tests para src/agent.ts
 * Prueba el flujo de recepción de jobs y despacho de resultados
 * usando un socket.io-client simulado.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PrintAgent } from '../src/agent'
import type { PrintAgentConfig } from '../src/config'
import type { Printer } from '../src/printer'

// ─── Mock socket.io-client ────────────────────────────────────────────────────

const socketEventHandlers: Record<string, ((...args: any[]) => void)[]> = {}
const emittedEvents: Array<{ event: string; data: unknown }> = []

const mockSocket = {
  id: 'mock-socket-id',
  connected: true,
  on: vi.fn((event: string, handler: (...args: any[]) => void) => {
    if (!socketEventHandlers[event]) socketEventHandlers[event] = []
    socketEventHandlers[event].push(handler)
  }),
  emit: vi.fn((event: string, data: unknown, _ack?: unknown) => {
    emittedEvents.push({ event, data })
  }),
  disconnect: vi.fn(),
}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}))

// ─── Mock @point-of-sale/receipt-printer-encoder ──────────────────────────────
// Sustituimos el encoder para evitar dependencia real en tests unitarios

vi.mock('@point-of-sale/receipt-printer-encoder', () => {
  /**
   * Clase de verdad, no un `vi.fn()`. El encoder se importa con `import X from`
   * y segun el interop la funcion mock no siempre llega como constructor; una
   * clase es constructible en todos los casos.
   */
  class EncoderMock {
    initialize() { return this }
    codepage() { return this }
    align() { return this }
    bold() { return this }
    width() { return this }
    height() { return this }
    text() { return this }
    newline() { return this }
    line() { return this }
    cut() { return this }
    encode() { return new Uint8Array([0x1b, 0x40]) }
  }
  return { default: EncoderMock, __esModule: true }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trigger(event: string, ...args: unknown[]) {
  for (const handler of socketEventHandlers[event] ?? []) {
    handler(...args)
  }
}

const baseConfig: PrintAgentConfig = {
  token: 'mpag_test',
  backendUrl: 'http://localhost:3001',
  printerType: 'file',
  filePath: '/tmp/test.bin',
  printerPort: 9100,
  serialBaudRate: 9600,
  heartbeatIntervalMs: 25_000,
  paperWidth: '80mm',
  logLevel: 'error', // silenciar logs en tests
}

const makePrinter = (): Printer => ({
  print: vi.fn().mockResolvedValue(undefined),
})

function makePrintJob(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    jobId: 'job-001',
    businessId: 'biz-001',
    agentId: 'agent-001',
    orderId: 'order-001',
    ticketType: 'RECEIPT',
    paperWidth: '80mm',
    timestamp: new Date().toISOString(),
    order: {
      id: 'order-001',
      code: 'P001',
      total: 45.5,
      items: [],
      serviceType: 'EN_MESA',
      createdAt: new Date().toISOString(),
    },
    branding: {
      businessName: 'Restaurante Test',
      businessAddress: 'Calle 1',
      businessPhone: '999999999',
      businessDocument: '12345678',
      businessLogoUrl: '',
      receiptPrimaryColor: '#000',
      receiptShowLogo: false,
      receiptShowCustomerName: true,
      receiptShowItemNotes: true,
      receiptShowOrderNotes: true,
      receiptHeaderText: '',
      receiptFooterText: 'Gracias',
      kitchenShowLogo: false,
      kitchenShowCustomerName: true,
      kitchenShowTableName: true,
      kitchenShowItemNotes: true,
      kitchenHeaderText: '',
      kitchenFooterText: '',
    },
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PrintAgent', () => {
  let printer: Printer
  let agent: PrintAgent

  beforeEach(() => {
    vi.clearAllMocks()
    emittedEvents.length = 0
    Object.keys(socketEventHandlers).forEach((k) => delete socketEventHandlers[k])
    printer = makePrinter()
    agent = new PrintAgent(baseConfig, printer)
    agent.connect()
  })

  it('se conecta al namespace /print-agent con el token correcto', async () => {
    const { io } = await import('socket.io-client')
    expect(io).toHaveBeenCalledWith(
      'http://localhost:3001/print-agent',
      expect.objectContaining({
        // En `auth`, no en `query`: es lo unico que el gateway del backend lee.
        auth: expect.objectContaining({ token: 'mpag_test' }),
        transports: ['websocket'],
      }),
    )
  })

  it('imprime un RECEIPT job y emite print:result con success=true', async () => {
    trigger('connect')
    const job = makePrintJob({ ticketType: 'RECEIPT' })
    trigger('print:job', job)

    // Esperar la promesa async del handler
    await vi.waitFor(() => expect(emittedEvents.some((e) => e.event === 'print:result')).toBe(true))

    expect(printer.print).toHaveBeenCalledTimes(1)
    const result = emittedEvents.find((e) => e.event === 'print:result')?.data as any
    expect(result.jobId).toBe('job-001')
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('imprime un KITCHEN job y emite print:result con success=true', async () => {
    trigger('connect')
    const job = makePrintJob({ ticketType: 'KITCHEN' })
    trigger('print:job', job)

    await vi.waitFor(() => expect(emittedEvents.some((e) => e.event === 'print:result')).toBe(true))

    const result = emittedEvents.find((e) => e.event === 'print:result')?.data as any
    expect(result.success).toBe(true)
    expect(result.ticketType).toBe('KITCHEN')
  })

  it('emite print:result con success=false cuando la impresora falla', async () => {
    ;(printer.print as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('PRINTER_OFFLINE'),
    )

    trigger('connect')
    const job = makePrintJob()
    trigger('print:job', job)

    await vi.waitFor(() => expect(emittedEvents.some((e) => e.event === 'print:result')).toBe(true))

    const result = emittedEvents.find((e) => e.event === 'print:result')?.data as any
    expect(result.success).toBe(false)
    expect(result.error).toContain('PRINTER_OFFLINE')
  })

  it('incluye orderId y ticketType en el resultado', async () => {
    trigger('connect')
    trigger('print:job', makePrintJob({ orderId: 'order-XYZ', ticketType: 'RECEIPT' }))

    await vi.waitFor(() => expect(emittedEvents.some((e) => e.event === 'print:result')).toBe(true))

    const result = emittedEvents.find((e) => e.event === 'print:result')?.data as any
    expect(result.orderId).toBe('order-XYZ')
    expect(result.ticketType).toBe('RECEIPT')
  })

  it('desconecta el socket al llamar disconnect()', () => {
    trigger('connect')
    agent.disconnect()
    expect(mockSocket.disconnect).toHaveBeenCalled()
  })
})

// ─── Cola de impresión ────────────────────────────────────────────────────────

/**
 * La térmica es un recurso de a uno. Al cobrar, el panel manda la comanda y el
 * comprobante casi a la vez; antes cada trabajo imprimía por su cuenta, así que
 * en una impresora de red de una sola conexión el segundo podía chocar con el
 * primero, y con PowerShell por ticket terminaban en el orden en que cada
 * proceso acababa de arrancar, no en el que llegaron.
 */
describe('cola de impresión', () => {
  /** Un `print` que solo termina cuando el test lo decide, anotando cuándo empieza y acaba. */
  function impresoraControlada() {
    const bitacora: string[] = []
    const terminar: Array<() => void> = []
    const fallar: Array<(e: Error) => void> = []
    const printer: Printer = {
      print: vi.fn(
        () =>
          new Promise<void>((resolve, reject) => {
            const n = terminar.length + 1
            bitacora.push(`empieza ${n}`)
            terminar.push(() => {
              bitacora.push(`termina ${n}`)
              resolve()
            })
            fallar.push((e) => {
              bitacora.push(`falla ${n}`)
              reject(e)
            })
          }),
      ),
    }
    return { printer, bitacora, terminar, fallar }
  }

  let agent: PrintAgent
  beforeEach(() => {
    vi.clearAllMocks()
    emittedEvents.length = 0
    Object.keys(socketEventHandlers).forEach((k) => delete socketEventHandlers[k])
  })

  const resultados = () =>
    emittedEvents.filter((e) => e.event === 'print:result').map((e) => e.data as any)
  const esperar = () => new Promise((r) => setTimeout(r, 15))

  it('dos trabajos a la vez se imprimen uno tras otro, nunca solapados, en orden de llegada', async () => {
    const { printer, bitacora, terminar } = impresoraControlada()
    agent = new PrintAgent(baseConfig, printer)
    agent.connect()
    trigger('connect')

    trigger('print:job', makePrintJob({ jobId: 'comanda', ticketType: 'KITCHEN' }))
    trigger('print:job', makePrintJob({ jobId: 'comprobante', ticketType: 'RECEIPT' }))
    await esperar()

    // El segundo NO empieza mientras el primero sigue en la impresora.
    expect(bitacora).toEqual(['empieza 1'])

    terminar[0]!()
    await vi.waitFor(() => expect(bitacora).toContain('empieza 2'))
    terminar[1]!()
    await vi.waitFor(() => expect(resultados()).toHaveLength(2))

    expect(bitacora).toEqual(['empieza 1', 'termina 1', 'empieza 2', 'termina 2'])
    expect(resultados().map((r) => r.jobId)).toEqual(['comanda', 'comprobante'])
  })

  it('el resultado de cada trabajo sale cuando SU ticket se imprimió, sin esperar a los siguientes', async () => {
    const { printer, terminar } = impresoraControlada()
    agent = new PrintAgent(baseConfig, printer)
    agent.connect()
    trigger('connect')

    trigger('print:job', makePrintJob({ jobId: 'a' }))
    trigger('print:job', makePrintJob({ jobId: 'b' }))
    await esperar()
    terminar[0]!()

    await vi.waitFor(() => expect(resultados()).toHaveLength(1))
    expect(resultados()[0]).toMatchObject({ jobId: 'a', success: true })
  })

  it('si el primer ticket falla, el siguiente se imprime igual y cada uno reporta lo suyo', async () => {
    const { printer, bitacora, terminar, fallar } = impresoraControlada()
    agent = new PrintAgent(baseConfig, printer)
    agent.connect()
    trigger('connect')

    trigger('print:job', makePrintJob({ jobId: 'a' }))
    trigger('print:job', makePrintJob({ jobId: 'b' }))
    await esperar()
    fallar[0]!(new Error('PAPEL AGOTADO'))
    await vi.waitFor(() => expect(bitacora).toContain('empieza 2'))
    terminar[1]!()
    await vi.waitFor(() => expect(resultados()).toHaveLength(2))

    const [a, b] = resultados()
    expect(a).toMatchObject({ jobId: 'a', success: false })
    expect(a.error).toContain('PAPEL AGOTADO')
    expect(b).toMatchObject({ jobId: 'b', success: true })
  })

  it('un ticket que no se entiende falla sin ocupar la impresora ni frenar la cola', async () => {
    const { printer, bitacora, terminar } = impresoraControlada()
    agent = new PrintAgent(baseConfig, printer)
    agent.connect()
    trigger('connect')

    trigger('print:job', makePrintJob({ jobId: 'raro', ticketType: 'NO_EXISTE' }))
    trigger('print:job', makePrintJob({ jobId: 'bueno' }))
    await vi.waitFor(() => expect(bitacora).toContain('empieza 1'))
    terminar[0]!()
    await vi.waitFor(() => expect(resultados()).toHaveLength(2))

    expect(resultados().find((r) => r.jobId === 'raro')).toMatchObject({ success: false })
    expect(printer.print).toHaveBeenCalledTimes(1)
  })
})

// ─── Autenticacion del handshake ──────────────────────────────────────────────

describe('handshake con el backend', () => {
  /**
   * REGRESION REAL: el token viajaba en `query`, pero el gateway del backend
   * (print-agent.gateway.ts, extractToken) solo lee `handshake.auth.token` y la
   * cabecera Authorization. El resultado era que el socket conectaba y el
   * servidor lo echaba con `client.disconnect(true)`, asi que la app mostraba
   * "Desconectado" en gris —no "Error"— y parecia un problema de red.
   */
  it('manda el token en auth, que es lo unico que el gateway lee', async () => {
    const { io } = await import('socket.io-client')
    ;(io as unknown as ReturnType<typeof vi.fn>).mockClear()

    const agent = new PrintAgent(baseConfig, makePrinter())
    agent.connect()

    const opciones = (io as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1]
    expect(opciones.auth).toEqual(expect.objectContaining({ token: 'mpag_test' }))
  })

  /**
   * La API solo manda precuentas y cierres de caja a quien declara PREVENTA y
   * CASH_CLOSE: un agente viejo imprimiria una precuenta como comprobante, sin
   * el aviso de que no es un comprobante de pago.
   */
  it('lleva la version de package.json y las capacidades junto al token', async () => {
    const { io } = await import('socket.io-client')
    ;(io as unknown as ReturnType<typeof vi.fn>).mockClear()

    new PrintAgent(baseConfig, makePrinter()).connect()

    const { version } = await import('../package.json')
    const opciones = (io as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1]
    expect(opciones.auth).toEqual({
      token: 'mpag_test',
      version,
      capacidades: ['PREVENTA', 'CASH_CLOSE', 'ELECTRONICO'],
    })
  })

  it('no lo manda en query, donde el backend nunca lo mira', async () => {
    const { io } = await import('socket.io-client')
    ;(io as unknown as ReturnType<typeof vi.fn>).mockClear()

    const agent = new PrintAgent(baseConfig, makePrinter())
    agent.connect()

    const opciones = (io as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1]
    expect(opciones.query).toBeUndefined()
  })
})
