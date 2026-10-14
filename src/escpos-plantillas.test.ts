import { describe, it, expect } from 'vitest'
import { encodeKitchenTicket, encodeReceiptTicket } from './escpos'
import type { PrintBranding } from './escpos'
import { PRESETS, formatoConPlantilla, parseEscPos, plantillaPorDefecto } from './vendor/printing'

/**
 * El editor de tickets del panel guarda la plantilla de cada documento DENTRO
 * del JSON de formato que la API ya le manda al agente. El agente no tiene que
 * saber nada de plantillas: le basta con pasar ese JSON al paquete, como hacia.
 *
 * Estos tests lo prueban con el JSON tal como llega por websocket —una cadena—
 * y con las funciones del propio agente, no con el paquete suelto: si alguien
 * cambiara como el agente arma la marca o el pedido, se veria aqui.
 */

const branding = {
  businessName: 'DON CEVICHON',
  businessPhone: '+51 935249013',
  kitchenHeaderText: 'COMANDA',
  kitchenShowTableName: true,
  kitchenShowItemNotes: true,
} as unknown as PrintBranding

const orden = {
  id: 'o1',
  code: '20261008-027-509528',
  createdAt: '2026-10-08T21:38:00.000Z',
  serviceType: 'EN_MESA',
  table: { name: 'Mesa 4' },
  total: 20,
  items: [{ quantity: 2, menuItem: { name: 'Ceviche mixto' }, unitPrice: 10, subtotal: 20, roundNumber: 1 }],
} as Record<string, unknown>

const lineas = (bytes: Uint8Array) => parseEscPos(bytes).map((l) => l.texto.trim()).filter(Boolean)

describe('el agente obedece las plantillas del editor', () => {
  it('sin plantilla, la comanda sale como siempre', () => {
    const texto = lineas(encodeKitchenTicket(orden, '80mm', branding))

    expect(texto).toContain('DON CEVICHON')
    expect(texto.some((l) => l.includes('ORDEN'))).toBe(true)
  })

  it('con «Solo cocina» la comanda pierde el negocio y el numero de orden', () => {
    const preset = PRESETS.comanda.find((p) => p.nombre === 'Solo cocina')
    expect(preset).toBeDefined()

    const kitchenFormatConfig = JSON.stringify(formatoConPlantilla({}, 'comanda', preset!.plantilla))
    const texto = lineas(encodeKitchenTicket(orden, '80mm', { ...branding, kitchenFormatConfig }))

    expect(texto.join('\n')).not.toContain('DON CEVICHON')
    expect(texto.some((l) => l.includes('ORDEN'))).toBe(false)
    expect(texto.join('\n')).toContain('MESA 4')
  })

  it('la etiqueta del telefono del comprobante sale como la escribio el negocio', () => {
    const plantilla = plantillaPorDefecto('comprobante')
    plantilla.blocks = plantilla.blocks.map((b) => (b.type === 'phone' ? { ...b, label: 'WSP' } : b))
    const receiptFormatConfig = JSON.stringify(formatoConPlantilla({}, 'comprobante', plantilla))

    const texto = lineas(encodeReceiptTicket(orden, '80mm', { ...branding, receiptFormatConfig }))

    expect(texto).toContain('WSP: +51 935249013')
    expect(texto.join('\n')).not.toContain('Tel:')
  })

  it('un JSON de formato roto no deja al local sin ticket', () => {
    const texto = lineas(encodeKitchenTicket(orden, '80mm', { ...branding, kitchenFormatConfig: '{roto' }))

    expect(texto).toContain('DON CEVICHON')
  })
})
