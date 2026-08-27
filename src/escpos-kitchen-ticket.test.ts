import { describe, it, expect } from 'vitest'
import { encodeKitchenTicket } from './escpos'
import type { PrintBranding } from './escpos'

/**
 * El ticket de cocina se lee colgado y con prisa, no en la mano. Los platos
 * salen al mismo cuerpo que el nombre del negocio (ESC ! con doble ancho y
 * alto); el resto —hora, mesa, quien atiende— se queda en cuerpo normal porque
 * son datos de apoyo y agrandarlos solo gasta papel.
 */

/** GS ! n — n=0x11 es doble ancho + doble alto; n=0x00 vuelve a normal. */
const DOBLE = '\x1d!\x11'
const NORMAL = '\x1d!\x00'

const branding = {
  businessName: 'DON CEVICHON',
  kitchenHeaderText: 'COMANDA',
  kitchenShowTableName: true,
  kitchenShowItemNotes: true,
} as unknown as PrintBranding

const orden = (items: unknown[]) =>
  ({
    id: 'o1',
    code: '20260827-001',
    createdAt: '2026-08-27T12:00:00.000Z',
    serviceType: 'EN_MESA',
    table: { name: 'Mesa 4' },
    items,
  }) as unknown as Record<string, unknown>

const texto = (bytes: Uint8Array) => Buffer.from(bytes).toString('latin1')

describe('comanda de cocina · tamaño de letra', () => {
  it('los platos salen al mismo cuerpo que el nombre del negocio', () => {
    const t = texto(
      encodeKitchenTicket(
        orden([{ quantity: 1, menuItem: { name: 'CEVICHE MIXTO' } }]),
        '80mm',
        branding,
      ),
    )

    // El nombre del negocio ya salía a doble cuerpo; ahora el plato también.
    expect(t).toContain('DON CEVICHON')
    expect(t).toContain('CEVICHE MIXTO')

    const posPlato = t.indexOf('CEVICHE MIXTO')
    const dobleAntesDelPlato = t.lastIndexOf(DOBLE, posPlato)
    const normalAntesDelPlato = t.lastIndexOf(NORMAL, posPlato)
    // Lo último que se declaró antes del plato es el cuerpo doble.
    expect(dobleAntesDelPlato).toBeGreaterThan(normalAntesDelPlato)
  })

  it('vuelve a cuerpo normal después de los platos', () => {
    const t = texto(
      encodeKitchenTicket(
        orden([
          {
            quantity: 2,
            menuItem: { name: 'ARROZ CON MARISCOS' },
            notes: 'sin culantro',
          },
        ]),
        '80mm',
        branding,
      ),
    )

    // La nota del plato es un detalle: no debe heredar el cuerpo doble.
    const posNota = t.indexOf('sin culantro')
    expect(posNota).toBeGreaterThan(-1)
    expect(t.lastIndexOf(NORMAL, posNota)).toBeGreaterThan(
      t.lastIndexOf(DOBLE, posNota),
    )
  })

  it('corta el nombre largo a la mitad de columnas, que es lo que entra a doble ancho', () => {
    // A doble ancho entran 24 caracteres en 80mm, no 48. Con `columns` sin
    // dividir, la impresora partía el nombre por donde le tocaba.
    const t = texto(
      encodeKitchenTicket(
        orden([
          {
            quantity: 1,
            menuItem: { name: 'CHICHARRON DE PESCADO CON YUCA Y SALSA CRIOLLA' },
          },
        ]),
        '80mm',
        branding,
      ),
    )

    const lineas = t
      .split('\n')
      .filter((l) => /CHICHARRON|PESCADO|CRIOLLA|YUCA/.test(l))
      // Quitar los códigos de control para medir solo lo imprimible.
      .map((l) => l.replace(/\x1d!.|\x1b[@!a-zA-Z].?/g, '').trim())

    expect(lineas.length).toBeGreaterThan(1) // se partió en varias líneas
    for (const linea of lineas) {
      expect(linea.length).toBeLessThanOrEqual(24)
    }
  })

  it('la hora y la mesa siguen en cuerpo normal', () => {
    const t = texto(
      encodeKitchenTicket(
        orden([{ quantity: 1, menuItem: { name: 'CEVICHE' } }]),
        '80mm',
        branding,
      ),
    )

    const posMesa = t.indexOf('Mesa 4')
    expect(posMesa).toBeGreaterThan(-1)
    expect(t.lastIndexOf(NORMAL, posMesa)).toBeGreaterThan(
      t.lastIndexOf(DOBLE, posMesa),
    )
  })
})
