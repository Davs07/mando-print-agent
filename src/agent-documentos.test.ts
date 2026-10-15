import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PrintAgent } from './agent'
import type { PrintAgentConfig } from './config'
import type { Printer } from './printer'
import { formatoConPlantilla, parseEscPos, plantillaPorDefecto } from './vendor/printing'

/**
 * Lo que el agente IMPRIME de verdad, de punta a punta: el trabajo llega como
 * llega por el websocket (el formato como cadena JSON), pasa por `PrintAgent` y
 * se leen los bytes que habrian ido a la impresora. A diferencia de
 * `agent.test.ts`, aqui el encoder NO esta simulado: lo que se prueba es el
 * dibujo, no el despacho.
 */

const emitidos: Array<{ event: string; data: any }> = []
const manejadores: Record<string, Array<(...args: any[]) => void>> = {}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    id: 'socket-test',
    connected: true,
    on: (event: string, handler: (...args: any[]) => void) => {
      ;(manejadores[event] ??= []).push(handler)
    },
    emit: (event: string, data: unknown) => {
      emitidos.push({ event, data })
    },
    disconnect: vi.fn(),
  })),
}))

const config: PrintAgentConfig = {
  token: 'mpag_test',
  backendUrl: 'http://localhost:3001',
  printerType: 'file',
  filePath: '/tmp/test.bin',
  printerPort: 9100,
  serialBaudRate: 9600,
  heartbeatIntervalMs: 25_000,
  paperWidth: '80mm',
  logLevel: 'error',
}

const branding = {
  businessName: 'DON CEVICHON',
  businessAddress: 'Jr. Lima 123',
  businessPhone: '+51 935249013',
  businessDocument: '20123456789',
  receiptFooterText: 'Gracias',
  receiptFormatConfig: '',
}

const pedido = {
  id: 'o1',
  code: '20261008-027',
  createdAt: '2026-10-08T21:38:00.000Z',
  serviceType: 'EN_MESA',
  table: { name: 'Mesa 4' },
  subtotal: 20,
  total: 20,
  items: [{ quantity: 2, menuItem: { name: 'Ceviche mixto' }, unitPrice: 10, subtotal: 20, roundNumber: 1 }],
}

const cierre = {
  cashBoxName: 'Caja principal',
  openedByName: 'Rodrigo',
  closedByName: 'Rodrigo',
  openedAt: '2026-10-08T17:00:00.000Z',
  closedAt: '2026-10-09T04:00:00.000Z',
  initialAmount: 100,
  salesByMethod: [
    { label: 'Efectivo', total: 640 },
    { label: 'Yape', total: 310 },
  ],
  totalSales: 950,
  cashSales: 640,
  manualIncome: 20,
  manualExpense: 45,
  totalIncome: 660,
  totalExpense: 45,
  movements: [
    { type: 'EXPENSE', description: 'Hielo', category: 'Insumos', amount: 15, at: '2026-10-08T22:05:00.000Z' },
    { type: 'EXPENSE', description: 'Balon de gas', category: 'Servicios', amount: 30, at: '2026-10-08T23:30:00.000Z' },
  ],
  expectedAmount: 715,
  countedAmount: 710,
  difference: -5,
}

function trabajo(extra: Record<string, unknown>) {
  return {
    jobId: 'job-1',
    businessId: 'biz-1',
    agentId: 'agent-1',
    orderId: 'o1',
    ticketType: 'RECEIPT',
    paperWidth: '80mm',
    order: pedido,
    branding,
    timestamp: '2026-10-08T21:40:00.000Z',
    ...extra,
  }
}

describe('el agente imprime los documentos nuevos', () => {
  let impresos: Uint8Array[]
  let printer: Printer

  /** Despacha el trabajo y espera el resultado que el agente le devuelve a la API. */
  async function despachar(payload: unknown) {
    emitidos.length = 0
    for (const h of manejadores['print:job'] ?? []) h(payload)
    await vi.waitFor(() => expect(emitidos.some((e) => e.event === 'print:result')).toBe(true))
    return emitidos.find((e) => e.event === 'print:result')!.data as any
  }

  const texto = (bytes: Uint8Array) =>
    parseEscPos(bytes)
      .map((l) => l.texto.trim())
      .filter(Boolean)
      .join('\n')

  beforeEach(() => {
    impresos = []
    printer = { print: vi.fn(async (b: Uint8Array) => void impresos.push(b)) } as unknown as Printer
    for (const k of Object.keys(manejadores)) delete manejadores[k]
    new PrintAgent(config, printer).connect()
  })

  describe('RECEIPT con y sin preventa', () => {
    it('con preventa sale la precuenta, con su aviso de que no es comprobante de pago', async () => {
      const r = await despachar(trabajo({ preventa: true }))

      expect(r.success).toBe(true)
      expect(texto(impresos[0]).toLowerCase()).toContain('no es comprobante de pago')
    })

    it('sin preventa sale el comprobante de siempre, sin el aviso', async () => {
      const r = await despachar(trabajo({}))

      expect(r.success).toBe(true)
      const t = texto(impresos[0])
      expect(t.toLowerCase()).not.toContain('no es comprobante de pago')
      expect(t).toContain('DON CEVICHON')
      expect(t).toContain('Ceviche mixto')
    })

    it('con preventa: false tampoco lleva el aviso', async () => {
      await despachar(trabajo({ preventa: false }))

      expect(texto(impresos[0]).toLowerCase()).not.toContain('no es comprobante de pago')
    })
  })

  describe('CASH_CLOSE', () => {
    const delCierre = (extra: Record<string, unknown> = {}) =>
      trabajo({ ticketType: 'CASH_CLOSE', orderId: '', order: {}, cashBoxId: 'caja-1', cashClose: cierre, ...extra })

    it('sin diseno guardado sale con el de fabrica del cierre', async () => {
      const r = await despachar(delCierre())

      expect(r.success).toBe(true)
      const t = texto(impresos[0])
      expect(t).toContain('CIERRE DE CAJA')
      expect(t).toContain('EFECTIVO EN EL CAJON')
      expect(t).toContain('EGRESOS')
      expect(t).toContain('Hielo')
    })

    it('con la plantilla guardada en receiptFormatConfig, sale con esa', async () => {
      const plantilla = plantillaPorDefecto('cierre')
      plantilla.blocks = plantilla.blocks.map((b) =>
        b.type === 'cash_count' ? { ...b, label: 'DINERO EN CAJA' } : b,
      )
      // Como llega por websocket: una cadena JSON.
      const receiptFormatConfig = JSON.stringify(formatoConPlantilla({}, 'cierre', plantilla))

      await despachar(delCierre({ branding: { ...branding, receiptFormatConfig } }))

      const t = texto(impresos[0])
      expect(t).toContain('DINERO EN CAJA')
      expect(t).not.toContain('EFECTIVO EN EL CAJON')
    })

    it('con esCorte sale como CORTE DE CAJA, nunca como cierre', async () => {
      await despachar(
        delCierre({ cashClose: { ...cierre, esCorte: true, closedAt: null, countedAmount: null, difference: null } }),
      )

      const t = texto(impresos[0])
      expect(t).toContain('CORTE DE CAJA')
      expect(t).not.toContain('CIERRE DE CAJA')
    })

    it('el resultado lleva el tipo recibido y la caja', async () => {
      const r = await despachar(delCierre())

      expect(r.ticketType).toBe('CASH_CLOSE')
      expect(r.cashBoxId).toBe('caja-1')
      expect(r.orderId).toBe('')
    })

    it('un cierre sin datos no imprime y reporta el error', async () => {
      const r = await despachar(delCierre({ cashClose: undefined }))

      expect(r.success).toBe(false)
      expect(r.error).toContain('cashClose')
      expect(printer.print).not.toHaveBeenCalled()
    })
  })

  describe('tipos desconocidos', () => {
    it('no imprime nada y reporta el error, en vez de caer en la comanda', async () => {
      const r = await despachar(trabajo({ ticketType: 'ETIQUETA_FUTURA' }))

      expect(printer.print).not.toHaveBeenCalled()
      expect(r.success).toBe(false)
      expect(r.error).toContain('ETIQUETA_FUTURA')
      expect(r.ticketType).toBe('ETIQUETA_FUTURA')
    })

    it('un RECEIPT normal no lleva cashBoxId en el resultado', async () => {
      const r = await despachar(trabajo({}))

      expect('cashBoxId' in r).toBe(false)
    })
  })
})
