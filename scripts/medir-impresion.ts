/**
 * Mide cuánto tarda un ticket en el agente, separado en sus partes.
 *
 *   npx ts-node --transpile-only scripts/medir-impresion.ts [nombre-de-impresora]
 *
 * Sin nombre usa una impresora que NO existe: mide todo el sobrecosto fijo
 * (arranque de PowerShell, compilación del C#, protocolo, OpenPrinter) sin sacar
 * papel — que es justo lo que el residente quita. Con el nombre de una impresora
 * instalada imprime de verdad (un ticket de prueba por cada medición).
 *
 * Compara el camino de siempre (un PowerShell por ticket) con el residente, y
 * el costo de codificar una comanda y un comprobante para saber si el agente
 * mismo es parte del problema.
 */
import { WindowsPrinter } from '../src/printer'
import { encodeKitchenTicket, encodeReceiptTicket } from '../src/escpos'

const TICKETS = 6
const impresora = process.argv[2] ?? 'IMPRESORA-QUE-NO-EXISTE'
const real = process.argv[2] !== undefined

const branding = {
  businessName: 'Restaurante de prueba',
  businessAddress: 'Av. Principal 123',
  businessPhone: '999999999',
  businessDocument: '20123456789',
  businessLogoUrl: '',
  receiptPrimaryColor: '#000',
  receiptShowLogo: false,
  receiptShowCustomerName: true,
  receiptShowItemNotes: true,
  receiptShowOrderNotes: true,
  receiptHeaderText: '',
  receiptFooterText: 'Gracias por su visita',
  kitchenShowLogo: false,
  kitchenShowCustomerName: true,
  kitchenShowTableName: true,
  kitchenShowItemNotes: true,
  kitchenHeaderText: '',
  kitchenFooterText: '',
} as never

const items = Array.from({ length: 20 }, (_, i) => ({
  id: `i${i}`,
  quantity: 1 + (i % 3),
  unitPrice: 12.5 + i,
  subtotal: (1 + (i % 3)) * (12.5 + i),
  status: 'PENDIENTE',
  roundNumber: 1,
  notes: i % 4 === 0 ? 'sin cebolla' : '',
  item: { name: `Plato de prueba número ${i + 1}` },
}))
const orden = {
  id: 'o1',
  code: '20260827-001',
  createdAt: new Date().toISOString(),
  serviceType: 'EN_MESA',
  table: { name: 'Mesa 4' },
  items,
  total: items.reduce((t, i) => t + i.subtotal, 0),
  subtotal: items.reduce((t, i) => t + i.subtotal, 0),
} as unknown as Record<string, unknown>

function mediana(valores: number[]): number {
  const o = [...valores].sort((a, b) => a - b)
  return o[Math.floor(o.length / 2)]!
}
const fmt = (n: number) => `${n.toFixed(n < 10 ? 1 : 0)} ms`

async function tiempos(imprimir: () => Promise<void>): Promise<number[]> {
  const t: number[] = []
  for (let i = 0; i < TICKETS; i++) {
    const t0 = process.hrtime.bigint()
    await imprimir().catch(() => {}) // con la impresora inexistente falla a propósito
    t.push(Number(process.hrtime.bigint() - t0) / 1e6)
  }
  return t
}

async function main() {
  console.log(`Impresora: ${impresora}${real ? ' (REAL: saldrá papel)' : ' (inexistente: no sale papel)'}\n`)

  // ── Codificar ──
  const bytes = encodeReceiptTicket(orden, '80mm', branding, {})
  encodeKitchenTicket(orden, '80mm', branding)
  const cod: number[] = []
  for (let i = 0; i < 20; i++) {
    const t0 = process.hrtime.bigint()
    encodeReceiptTicket(orden, '80mm', branding, {})
    encodeKitchenTicket(orden, '80mm', branding)
    cod.push(Number(process.hrtime.bigint() - t0) / 1e6)
  }
  console.log(`Codificar comprobante + comanda (20 ítems): mediana ${fmt(mediana(cod))}  (${bytes.length} bytes)\n`)

  // ── El camino de siempre: un PowerShell por ticket ──
  const antes = new WindowsPrinter(impresora, 60_000, { residente: false })
  const t1 = await tiempos(() => antes.print(bytes))
  console.log(`Un PowerShell por ticket:  ${t1.map(fmt).join(' · ')}`)
  console.log(`   → mediana ${fmt(mediana(t1))} POR TICKET\n`)

  // ── El residente ──
  const ahora = new WindowsPrinter(impresora, 60_000)
  const c0 = process.hrtime.bigint()
  await ahora.warmUp() // lo que ocurre al abrir la app, ANTES del primer cliente
  console.log(`Residente — arranque + warm-up (una vez, al abrir la app): ${fmt(Number(process.hrtime.bigint() - c0) / 1e6)}`)
  const t2 = await tiempos(() => ahora.print(bytes))
  console.log(`Residente:                 ${t2.map(fmt).join(' · ')}`)
  console.log(`   → mediana ${fmt(mediana(t2))} POR TICKET`)
  ahora.close()

  console.log(`\nAhorro por ticket: ${fmt(mediana(t1) - mediana(t2))}  (${(mediana(t1) / Math.max(mediana(t2), 0.1)).toFixed(0)}× más rápido)`)
}

main().then(() => process.exit(0))
