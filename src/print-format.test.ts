import { describe, it, expect } from 'vitest'
import { encodeKitchenTicket, type PrintBranding } from './escpos'
import {
  leerFormato,
  seccionesOrdenadas,
  DEFAULT_KITCHEN_FORMAT,
  type PrintSectionKey,
} from './print-format'

/**
 * El agente es el camino de impresion recomendado, y hasta ahora ignoraba por
 * completo el panel «Formato avanzado» del negocio: mayusculas, negritas y orden
 * de secciones no le llegaban (la API no los mandaba) ni los miraba.
 *
 * El negocio configuraba el diseno, imprimia por el agente y no cambiaba nada.
 */

const POR_DEFECTO = DEFAULT_KITCHEN_FORMAT.sectionOrder as PrintSectionKey[]

const branding = (extra: Partial<PrintBranding> = {}) =>
  ({
    businessName: 'Don Cevichon',
    kitchenHeaderText: 'Comanda',
    kitchenFooterText: 'Buen provecho',
    kitchenShowTableName: true,
    kitchenShowItemNotes: true,
    ...extra,
  }) as unknown as PrintBranding

const orden = () =>
  ({
    id: 'o1',
    code: '20260827-001',
    createdAt: '2026-08-27T12:00:00.000Z',
    serviceType: 'EN_MESA',
    table: { name: 'Mesa 4' },
    notes: 'Cliente con prisa',
    items: [{ quantity: 1, menuItem: { name: 'Ceviche' } }],
  }) as unknown as Record<string, unknown>

const texto = (b: Uint8Array) => Buffer.from(b).toString('latin1')

describe('leerFormato', () => {
  it('sin nada configurado usa el formato por defecto', () => {
    expect(leerFormato('', DEFAULT_KITCHEN_FORMAT).uppercase).toBe(true)
    expect(leerFormato(undefined, DEFAULT_KITCHEN_FORMAT).uppercase).toBe(true)
  })

  it('lo guardado pisa al por defecto', () => {
    expect(leerFormato('{"uppercase":false}', DEFAULT_KITCHEN_FORMAT).uppercase).toBe(false)
  })

  /** Un ticket que no sale es peor que un ticket con el formato por defecto. */
  it('un JSON roto no tumba la impresion', () => {
    expect(leerFormato('{esto no es json', DEFAULT_KITCHEN_FORMAT).uppercase).toBe(true)
    expect(leerFormato('[1,2,3]', DEFAULT_KITCHEN_FORMAT).uppercase).toBe(true)
    expect(leerFormato('null', DEFAULT_KITCHEN_FORMAT).uppercase).toBe(true)
  })
})

describe('seccionesOrdenadas', () => {
  it('sin nada guardado usa el orden por defecto', () => {
    expect(seccionesOrdenadas({}, POR_DEFECTO)).toEqual(POR_DEFECTO)
  })

  it('agrega al final lo que el negocio no tenia guardado', () => {
    const r = seccionesOrdenadas({ sectionOrder: ['items', 'header'] }, POR_DEFECTO)
    expect(r.slice(0, 2)).toEqual(['items', 'header'])
    expect([...r].sort()).toEqual([...POR_DEFECTO].sort())
  })

  it('descarta claves inventadas y duplicados', () => {
    const r = seccionesOrdenadas(
      { sectionOrder: ['items', 'items', 'fantasma' as PrintSectionKey] },
      POR_DEFECTO,
    )
    expect(r.filter((s) => s === 'items')).toHaveLength(1)
    expect(r).not.toContain('fantasma')
  })
})

describe('comanda del agente · obedece al panel', () => {
  it('aplica mayusculas cuando el panel lo pide', () => {
    const t = texto(encodeKitchenTicket(orden(), '80mm', branding({
      kitchenFormatConfig: JSON.stringify({ uppercase: true }),
    })))

    expect(t).toContain('DON CEVICHON')
    expect(t).toContain('CEVICHE')
  })

  it('respeta minusculas cuando el panel las pide', () => {
    const t = texto(encodeKitchenTicket(orden(), '80mm', branding({
      kitchenFormatConfig: JSON.stringify({ uppercase: false }),
    })))

    expect(t).toContain('Don Cevichon')
    expect(t).not.toContain('DON CEVICHON')
  })

  it('el pie puede subir por encima del nombre del negocio', () => {
    const t = texto(encodeKitchenTicket(orden(), '80mm', branding({
      kitchenFormatConfig: JSON.stringify({
        uppercase: false,
        sectionOrder: ['footer', 'header', 'order_info', 'meta', 'notes', 'items'],
      }),
    })))

    expect(t.indexOf('Buen provecho')).toBeLessThan(t.indexOf('Don Cevichon'))
  })

  it('los platos pueden ir antes que la cabecera', () => {
    const t = texto(encodeKitchenTicket(orden(), '80mm', branding({
      kitchenFormatConfig: JSON.stringify({
        uppercase: false,
        sectionOrder: ['items', 'header', 'order_info', 'meta', 'notes', 'footer'],
      }),
    })))

    expect(t.indexOf('Ceviche')).toBeLessThan(t.indexOf('Don Cevichon'))
  })

  /** La nota del pedido es contexto para los platos: va antes. */
  it('por defecto la nota del pedido va antes que los platos', () => {
    const t = texto(encodeKitchenTicket(orden(), '80mm', branding()))

    expect(t.indexOf('CLIENTE CON PRISA')).toBeLessThan(t.indexOf('CEVICHE'))
  })

  it('sin formato configurado sigue imprimiendo', () => {
    const t = texto(encodeKitchenTicket(orden(), '80mm', branding()))

    expect(t).toContain('DON CEVICHON')
    expect(t).toContain('CEVICHE')
  })
})
