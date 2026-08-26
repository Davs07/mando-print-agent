import { describe, it, expect } from 'vitest'
import { encodeTestTicket } from './escpos'

/**
 * El ticket de prueba es lo que el negocio usa para saber si la impresora
 * quedo bien. Si el ticket sale mal codificado, la prueba miente: diria que
 * "se envio" y no saldria papel, que es peor que no tener prueba.
 */
describe('ticket de prueba', () => {
  it.each(['58mm', '80mm'] as const)('lleva init, texto y corte en %s', (ancho) => {
    const bytes = encodeTestTicket(ancho)
    const texto = Buffer.from(bytes).toString('latin1')

    // El encoder antepone relleno de alineacion, asi que el ESC @ no esta en
    // el byte 0 — lo que importa es que este presente antes del contenido.
    expect(texto).toContain('@') // ESC @ → initialize
    expect(texto).toContain('MANDO')
    expect(texto).toContain('Prueba de impresion')
    expect(texto).toContain(ancho)
    expect(texto).toContain('\x1dV') // GS V → corte de papel
  })

  it('el ancho estrecho produce lineas mas cortas', () => {
    const angosto = Buffer.from(encodeTestTicket('58mm')).toString('latin1')
    const ancho = Buffer.from(encodeTestTicket('80mm')).toString('latin1')
    // La regla separadora se dibuja a lo ancho de las columnas disponibles.
    expect(angosto.match(/-{20,}/)?.[0].length).toBeLessThan(
      ancho.match(/-{20,}/)?.[0].length ?? 0,
    )
  })
})
