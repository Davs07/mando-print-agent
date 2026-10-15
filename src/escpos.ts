/**
 * ESC/POS encoding — portado desde mando-frontend/lib/bluetooth-printing.ts
 * Sin dependencias de React ni Zustand; el branding llega como parámetro.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ReceiptPrinterEncoder = require('@point-of-sale/receipt-printer-encoder')

import {
  encodeCashCloseTicket as encodeCashCloseTicketShared,
  encodeElectronicDocumentTicket as encodeElectronicDocumentTicketShared,
  encodeKitchenTicket as encodeKitchenTicketShared,
  encodeReceiptTicket as encodeReceiptTicketShared,
  type CashCloseData,
  type DatosFiscales,
  type TicketOrder,
} from './vendor/printing'

export type PaperWidth = '58mm' | '80mm'

export interface PrintBranding {
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
  /**
   * «Formato avanzado» serializado, tal como lo manda la API. Cadena vacia = el
   * negocio nunca lo configuro. Opcionales porque un agente viejo puede recibir
   * un payload sin ellos, y al reves.
   */
  receiptFormatConfig?: string
  kitchenFormatConfig?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeText(value?: string | number | null): string {
  if (value === undefined || value === null) return ''
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function wrapText(text: string, maxWidth: number): string[] {
  if (text.length <= maxWidth) return [text]
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (!current) {
      if (word.length >= maxWidth) {
        lines.push(word.substring(0, maxWidth))
        current = word.substring(maxWidth) || ''
      } else {
        current = word
      }
    } else if ((current + ' ' + word).length <= maxWidth) {
      current += ' ' + word
    } else {
      lines.push(current)
      if (word.length >= maxWidth) {
        lines.push(word.substring(0, maxWidth))
        current = word.substring(maxWidth) || ''
      } else {
        current = word
      }
    }
  }
  if (current) lines.push(current)
  return lines
}

// ---------------------------------------------------------------------------
// Ticket de Venta (RECEIPT)
// ---------------------------------------------------------------------------

/**
 * Comprobante de cortesia.
 *
 * El dibujo es de `@mando/printing`. Antes habia aqui una copia completa del
 * encoder del panel, y ya habian divergido: aquella obedecia «Formato avanzado»
 * y esta no, y ni las fechas ni los separadores coincidian.
 */
export function encodeReceiptTicket(
  order: Record<string, unknown>,
  paperWidth: PaperWidth,
  branding: PrintBranding,
  opciones: { preventa?: boolean } = {},
): Uint8Array {
  return encodeReceiptTicketShared(aTicketOrder(order), branding, {
    paperWidth,
    format: branding.receiptFormatConfig,
    // La precuenta usa el mismo diseno que el comprobante pero sale con su aviso
    // de que no es comprobante de pago. Sin este paso, el cliente se podria
    // llevar una precuenta creyendo que es su comprobante.
    preventa: opciones.preventa === true,
  })
}

// ---------------------------------------------------------------------------
// Cierre y corte de caja (CASH_CLOSE)
// ---------------------------------------------------------------------------

/**
 * Cierre (o corte) de caja.
 *
 * Lo arma la API con la forma de `CashCloseData` y se dibuja con el MISMO
 * paquete y el mismo formato del comprobante (`receiptFormatConfig`) que usa el
 * panel al imprimir desde el navegador: el negocio disena una sola plantilla y
 * tiene que salir igual por la web y por el agente.
 */
export function encodeCashCloseTicket(
  cashClose: Record<string, unknown>,
  paperWidth: PaperWidth,
  branding: PrintBranding,
): Uint8Array {
  return encodeCashCloseTicketShared(cashClose as unknown as CashCloseData, branding, {
    paperWidth,
    format: branding.receiptFormatConfig,
  })
}

// ---------------------------------------------------------------------------
// Boleta y factura electronica (ELECTRONIC)
// ---------------------------------------------------------------------------

/**
 * Boleta o factura electronica ya emitida.
 *
 * El pedido se traduce con el mismo adaptador del comprobante y los datos
 * fiscales (serie, correlativo, cliente, importes) llegan ya armados desde la
 * API. El dibujo es el del documento `electronico` del editor: la plantilla
 * guardada en `receiptFormatConfig` o, si el negocio nunca la diseno, la de
 * fabrica. Es el mismo codigo que usa el panel, asi que sale igual.
 *
 * Lanza si `fiscal` falta o no trae serie y correlativo: un papel que dice
 * «BOLETA DE VENTA ELECTRONICA» sin numero es un comprobante falso, y el
 * trabajo debe fallar a la vista de la API antes que imprimirlo.
 */
export function encodeElectronicTicket(
  order: Record<string, unknown>,
  fiscal: Record<string, unknown> | null | undefined,
  paperWidth: PaperWidth,
  branding: PrintBranding,
): Uint8Array {
  if (!fiscal || typeof fiscal !== 'object') {
    throw new Error('El comprobante electronico llego sin datos fiscales (fiscal)')
  }
  return encodeElectronicDocumentTicketShared(
    aTicketOrder(order),
    fiscal as unknown as DatosFiscales,
    branding,
    { paperWidth, format: branding.receiptFormatConfig },
  )
}

// ---------------------------------------------------------------------------
// Comanda de Cocina (KITCHEN)
// ---------------------------------------------------------------------------

interface KitchenGroup {
  round: number
  station: string
  items: any[]
}

function groupKitchenItems(items: any[]): KitchenGroup[] {
  const groups: KitchenGroup[] = []
  for (const item of items ?? []) {
    if (item.status === 'CANCELADO') continue
    const round: number = item.roundNumber ?? 1
    const station: string =
      item.menuItem?.menuDetails?.preparationStation ??
      item.item?.menuDetails?.preparationStation ??
      'COCINA'
    const existing = groups.find((g) => g.round === round && g.station === station)
    if (existing) {
      existing.items.push(item)
    } else {
      groups.push({ round, station, items: [item] })
    }
  }
  return groups.sort((a, b) =>
    a.round !== b.round ? a.round - b.round : a.station.localeCompare(b.station),
  )
}

/**
 * Adapta el pedido que llega por websocket a la forma neutra del paquete.
 *
 * El backend manda datos crudos y el ticket lo arma este agente, asi que aqui
 * es donde se traduce. El dibujo NO vive aqui: vive en `@mando/printing`, que
 * es la misma implementacion que usa el panel para Bluetooth, RawBT y WiFi.
 */
function aTicketOrder(order: Record<string, unknown>): TicketOrder {
  const o = order as any
  return {
    id: o.id,
    code: o.code,
    createdAt: o.createdAt ?? null,
    serviceType: o.serviceType ?? null,
    tableName: String(o.table?.name || o.table?.number || ''),
    customerName: o.customerName ?? null,
    attendantName: o.user?.name || o.collaborator?.user?.name || null,
    notes: o.notes ?? null,
    // Los importes: sin ellos el comprobante sale con TOTAL 0.00. La comanda no
    // los usa, y por eso el adaptador nacio sin ellos.
    subtotal: o.subtotal ?? null,
    tax: o.tax ?? null,
    discount: o.discount ?? null,
    total: o.total ?? null,
    items: (o.items ?? []).map((item: any) => ({
      quantity: item.quantity,
      name: item.menuItem?.name || item.item?.name || item.menuItemId || 'Item',
      variantName: item.variantName ?? null,
      notes: item.notes ?? null,
      roundNumber: item.roundNumber ?? null,
      status: item.status ?? null,
      preparationStation:
        item.menuItem?.menuDetails?.preparationStation ??
        item.item?.menuDetails?.preparationStation ??
        null,
      unitPrice: item.unitPrice ?? null,
      subtotal: item.subtotal ?? null,
    })),
  }
}

/**
 * Comanda de cocina.
 *
 * El dibujo es de `@mando/printing`. Antes habia aqui una copia completa del
 * encoder del panel, y se separaron sin que nadie lo notara: el tamano de letra
 * se corrigio primero solo aqui, y por Bluetooth siguio saliendo chico.
 */
export function encodeKitchenTicket(
  order: Record<string, unknown>,
  paperWidth: PaperWidth,
  branding: PrintBranding,
): Uint8Array {
  return encodeKitchenTicketShared(aTicketOrder(order), branding, {
    paperWidth,
    format: branding.kitchenFormatConfig,
  })
}

// ---------------------------------------------------------------------------
// Ticket de prueba
// ---------------------------------------------------------------------------

/**
 * Ticket corto para verificar la configuracion sin esperar un pedido real.
 *
 * POR QUE EXISTE: antes la unica forma de saber si la impresora estaba bien
 * configurada era esperar a que cayera una comanda. Si fallaba, el negocio se
 * enteraba con un cliente delante. Esto recorre exactamente el mismo camino
 * que un ticket de verdad —mismo encoder, mismo transporte, mismo corte—, asi
 * que si sale impreso, los reales tambien saldran.
 */
export function encodeTestTicket(paperWidth: PaperWidth = '80mm'): Uint8Array {
  const columns = paperWidth === '58mm' ? 32 : 48
  const encoder = new ReceiptPrinterEncoder({ columns })

  return encoder
    .initialize()
    .align('center')
    .bold(true)
    .size(2)
    .line('MANDO')
    .size(1)
    .bold(false)
    .newline()
    .line('Prueba de impresion')
    .line('-'.repeat(columns))
    .align('left')
    .newline()
    .line('Si lees esto, la impresora quedo')
    .line('bien configurada.')
    .newline()
    .line(`Ancho de papel: ${paperWidth}`)
    .line(`Fecha: ${new Date().toLocaleString('es-PE')}`)
    .newline()
    .align('center')
    .line('-'.repeat(columns))
    .line('Ya puedes cerrar esta ventana.')
    .newline()
    .newline()
    .cut()
    .encode()
}
