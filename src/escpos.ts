/**
 * ESC/POS encoding — portado desde mando-frontend/lib/bluetooth-printing.ts
 * Sin dependencias de React ni Zustand; el branding llega como parámetro.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ReceiptPrinterEncoder = require('@point-of-sale/receipt-printer-encoder')

import {
  DEFAULT_KITCHEN_FORMAT,
  leerFormato,
  seccionesOrdenadas,
  type PrintSectionKey,
} from './print-format'

/** Secciones de la comanda, en el orden por defecto. */
const KITCHEN_SECTIONS = DEFAULT_KITCHEN_FORMAT.sectionOrder as PrintSectionKey[]

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

export function encodeReceiptTicket(
  order: Record<string, unknown>,
  paperWidth: PaperWidth,
  branding: PrintBranding,
): Uint8Array {
  const columns = paperWidth === '58mm' ? 32 : 48
  const encoder = new ReceiptPrinterEncoder({ language: 'esc-pos', columns })
  const o = order as any

  const createdAt = o.createdAt ? new Date(o.createdAt) : new Date()
  const dateStr = createdAt.toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  let enc = encoder
    .initialize()
    .codepage('cp858')
    .align('center')
    .bold(true)
    .width(2)
    .height(2)
    .text(escapeText(branding.businessName || 'Ticket de Venta'))
    .newline()
    .width(1)
    .height(1)
    .bold(false)

  if (branding.receiptHeaderText) {
    branding.receiptHeaderText.split('\n').forEach((line) => {
      enc = enc.text(escapeText(line)).newline()
    })
  }

  enc = enc
    .bold(true)
    .text('Orden')
    .newline()
    .text(`#${escapeText(o.code || o.id)}`)
    .newline()
    .bold(false)
    .text(`Fecha: ${dateStr}`)
    .newline()

  if (branding.businessAddress) {
    wrapText(escapeText(branding.businessAddress), columns).forEach((line) => {
      enc = enc.text(line).newline()
    })
  }
  if (branding.businessPhone) {
    enc = enc.text(`Tel: ${escapeText(branding.businessPhone)}`).newline()
  }
  if (branding.businessDocument) {
    enc = enc.text(`Doc: ${escapeText(branding.businessDocument)}`).newline()
  }

  const rawTableName = (o.table?.name || o.table?.number || '') as string
  const cleanTableName = rawTableName.replace(/^Mesa\s+/i, '')

  if (o.serviceType === 'EN_MESA' && cleanTableName) {
    enc = enc.text(`Mesa ${escapeText(cleanTableName)}`).newline()
  } else if (o.serviceType) {
    enc = enc.text(`Servicio: ${escapeText(o.serviceType)}`).newline()
  }

  if (branding.receiptShowCustomerName) {
    const customerName = o.customerName || o.customer?.name
    if (customerName) {
      enc = enc.text(`Cliente: ${escapeText(customerName)}`).newline()
    }
  }

  const attendantName = o.user?.name || o.collaborator?.user?.name
  if (attendantName) {
    enc = enc.text(`Atiende: ${escapeText(attendantName)}`).newline()
  }

  enc = enc.newline().line('-').align('left')

  const items: any[] = o.items || []
  if (items.length === 0) {
    enc = enc.text('Sin items').newline()
  } else {
    for (const item of items) {
      let name = escapeText(
        item.menuItem?.name || item.item?.name || item.menuItemId || 'Item',
      )
      if (item.variantName) name += ` - ${escapeText(item.variantName)}`

      const qty = `${item.quantity}x `
      const subtotal =
        item.subtotal ?? Number(item.unitPrice || 0) * Number(item.quantity)
      const price = `S/${subtotal.toFixed(2)}`

      const qtyWidth = 4
      const priceWidth = 10
      const nameWidth = columns - qtyWidth - priceWidth
      const qtyStr = qty.padEnd(qtyWidth, ' ')
      const priceStr = price.padStart(priceWidth, ' ')
      const nameLines = wrapText(name, nameWidth)

      if (nameLines.length === 1) {
        enc = enc
          .text(`${qtyStr}${nameLines[0].padEnd(nameWidth, ' ')}${priceStr}`)
          .newline()
      } else {
        enc = enc.text(`${qtyStr}${nameLines[0]}`).newline()
        for (let i = 1; i < nameLines.length - 1; i++) {
          enc = enc.text(`${' '.repeat(qtyWidth)}${nameLines[i]}`).newline()
        }
        const lastLine = nameLines[nameLines.length - 1].padEnd(nameWidth, ' ')
        enc = enc
          .text(`${' '.repeat(qtyWidth)}${lastLine}${priceStr}`)
          .newline()
      }

      if (branding.receiptShowItemNotes && item.notes) {
        let n = escapeText(item.notes)
        if (n.length > columns - 4) n = n.substring(0, columns - 5)
        enc = enc.text(`    ${n}`).newline()
      }
    }
  }

  if (branding.receiptShowOrderNotes && o.notes) {
    const noteLines = wrapText(`Notas: ${escapeText(o.notes)}`, columns)
    enc = enc.align('left')
    for (const noteLine of noteLines) {
      enc = enc.text(noteLine).newline()
    }
  }

  return enc
    .line('-')
    .align('right')
    .bold(true)
    .text(`TOTAL: S/ ${Number(o.total || 0).toFixed(2)}`)
    .newline()
    .bold(false)
    .newline()
    .align('center')
    .text(escapeText(branding.receiptFooterText || 'Gracias por su preferencia.'))
    .newline()
    .newline()
    .newline()
    .newline()
    .cut()
    .encode()
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

export function encodeKitchenTicket(
  order: Record<string, unknown>,
  paperWidth: PaperWidth,
  branding: PrintBranding,
): Uint8Array {
  const columns = paperWidth === '58mm' ? 32 : 48
  const encoder = new ReceiptPrinterEncoder({ language: 'esc-pos', columns })
  const o = order as any

  // El panel de diseno del negocio. Hasta ahora el agente no lo miraba —de
  // hecho la API ni se lo mandaba—, asi que quien configuraba el formato e
  // imprimia por aqui no veia ningun cambio.
  const fmt = leerFormato(branding.kitchenFormatConfig, DEFAULT_KITCHEN_FORMAT)
  const uc = (s: string) => (fmt.uppercase ? s.toUpperCase() : s)
  const eb = (flag?: boolean) => (fmt.extraBold ? true : (flag ?? false))

  const createdAt = o.createdAt ? new Date(o.createdAt) : new Date()
  const timeStr = createdAt.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const rawTableName = (o.table?.name || o.table?.number || '') as string
  const cleanTableName = rawTableName.replace(/^Mesa\s+/i, '')

  /**
   * Cada seccion es un emisor independiente.
   *
   * OJO: todas fijan su propia alineacion al empezar. Es lo que permite
   * reordenarlas: si una diera por hecho el `align` que dejo la anterior,
   * cambiar el orden en el panel descuadraria el ticket en vez de reordenarlo.
   */
  const secciones: Record<PrintSectionKey, (e: any) => any> = {
    // El ticket termico no imprime logo; `kitchenShowLogo` es del ticket HTML.
    logo: (e) => e,

    header: (e) =>
      e
        .align('center')
        .bold(true)
        .width(2)
        .height(2)
        .text(uc(escapeText(branding.businessName || 'COMANDA')))
        .newline()
        .width(1)
        .height(1)
        .bold(true)
        .text(uc(escapeText(branding.kitchenHeaderText || 'COMANDA')))
        .newline()
        .bold(eb()),

    order_info: (e) =>
      e
        .align('center')
        .bold(eb(fmt.boldTitle !== false))
        .text(uc('Orden'))
        .newline()
        .bold(eb(fmt.boldOrderNumber !== false))
        .text(uc(`#${escapeText(o.code || o.id)}`))
        .newline()
        .bold(eb()),

    meta: (e) => {
      e = e.align('center').bold(eb()).text(uc(timeStr)).newline()

      if (branding.kitchenShowTableName && o.serviceType === 'EN_MESA' && cleanTableName) {
        e = e.text(uc(`Mesa ${escapeText(cleanTableName)}`)).newline()
      } else if (o.serviceType) {
        e = e.text(uc(escapeText(o.serviceType))).newline()
      }

      if (branding.kitchenShowCustomerName && o.customerName) {
        e = e.text(uc(`Cliente: ${escapeText(o.customerName)}`)).newline()
      }

      const atiende = o.user?.name || o.collaborator?.user?.name
      if (atiende) {
        e = e.text(uc(`Atiende: ${escapeText(atiende)}`)).newline()
      }
      return e
    },

    notes: (e) => {
      if (!o.notes) return e
      e = e.newline().align('center').line('-').align('left').bold(eb(fmt.boldOrderNotes))
      for (const linea of wrapText(uc(`Notas: ${escapeText(o.notes)}`), columns)) {
        e = e.text(linea).newline()
      }
      return e.bold(eb())
    },

    items: (e) => {
      for (const group of groupKitchenItems(o.items ?? [])) {
        const label =
          group.station === 'COCINA'
            ? `RONDA ${group.round}`
            : `RONDA ${group.round} (${group.station})`

        e = e
          .newline()
          .align('center')
          .line('-')
          .bold(true)
          .text(label)
          .newline()
          .line('-')
          .bold(eb())
          .align('left')

        for (const item of group.items) {
          let name = uc(escapeText(
            item.menuItem?.name || item.item?.name || item.menuItemId || 'Item',
          ))
          if (item.variantName) name += ` - ${uc(escapeText(item.variantName))}`

          // Los platos salen al mismo cuerpo que el nombre del negocio (width/height
          // 2). Es lo que se lee de lejos y con prisa: en la cocina el ticket se mira
          // colgado, no en la mano. El resto del ticket —hora, mesa, quien atiende—
          // se queda en cuerpo normal: son datos de apoyo y agrandarlos solo gasta
          // papel.
          //
          // OJO: a doble ancho entra la MITAD de caracteres por linea, asi que el
          // corte de palabras se calcula sobre `columns / 2`. Usar `columns` aqui
          // hacia que la impresora partiera el nombre por donde le tocara.
          const dobleColumns = Math.floor(columns / 2)
          const qtyWidth = 4
          const nameWidth = dobleColumns - qtyWidth
          const qtyStr = `${item.quantity}x `.padEnd(qtyWidth, ' ')
          const nameLines = wrapText(name, nameWidth)

          e = e.width(2).height(2)
          e = e.text(`${qtyStr}${nameLines[0]}`).newline()
          for (let i = 1; i < nameLines.length; i++) {
            e = e.text(`${' '.repeat(qtyWidth)}${nameLines[i]}`).newline()
          }
          e = e.width(1).height(1)

          if (branding.kitchenShowItemNotes && item.notes) {
            const note = escapeText(item.notes)
            e = e.text(`  * ${note.substring(0, columns - 4)}`).newline()
          }
        }
      }
      return e
    },

    // Una comanda no lleva importes: la cocina no cobra.
    total: (e) => e,

    footer: (e) => {
      if (!branding.kitchenFooterText) return e
      return e
        .newline()
        .align('center')
        .bold(eb(fmt.boldCustomText))
        .text(uc(escapeText(branding.kitchenFooterText)))
        .newline()
        .bold(eb())
    },
  }

  let enc = encoder.initialize().codepage('cp858')

  for (const clave of seccionesOrdenadas(fmt, KITCHEN_SECTIONS)) {
    enc = secciones[clave](enc)
  }

  return enc.newline().newline().newline().newline().newline().cut().encode()
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
