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
  const EncoderMock = vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockReturnThis(),
    codepage: vi.fn().mockReturnThis(),
    align: vi.fn().mockReturnThis(),
    bold: vi.fn().mockReturnThis(),
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    newline: vi.fn().mockReturnThis(),
    line: vi.fn().mockReturnThis(),
    cut: vi.fn().mockReturnThis(),
    encode: vi.fn().mockReturnValue(new Uint8Array([0x1b, 0x40])),
  }))
  return { default: EncoderMock }
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
        query: { token: 'mpag_test' },
        transports: ['websocket'],
      }),
    )
  })

  it('imprime un RECEIPT job y emite print:result con success=true', async () => {
    trigger('connect')
    const job = makePrintJob({ ticketType: 'RECEIPT' })
    trigger('print:job', job)

    // Esperar la promesa async del handler
    await vi.waitFor(() => {
      return emittedEvents.some((e) => e.event === 'print:result')
    })

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

    await vi.waitFor(() => emittedEvents.some((e) => e.event === 'print:result'))

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

    await vi.waitFor(() => emittedEvents.some((e) => e.event === 'print:result'))

    const result = emittedEvents.find((e) => e.event === 'print:result')?.data as any
    expect(result.success).toBe(false)
    expect(result.error).toContain('PRINTER_OFFLINE')
  })

  it('incluye orderId y ticketType en el resultado', async () => {
    trigger('connect')
    trigger('print:job', makePrintJob({ orderId: 'order-XYZ', ticketType: 'RECEIPT' }))

    await vi.waitFor(() => emittedEvents.some((e) => e.event === 'print:result'))

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
