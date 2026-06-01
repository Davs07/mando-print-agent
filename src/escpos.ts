/**
 * ESC/POS encoding — portado desde mando-frontend/lib/bluetooth-printing.ts
 * Sin dependencias de React ni Zustand; el branding llega como parámetro.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ReceiptPrinterEncoder = require('@point-of-sale/receipt-printer-encoder')

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

  const createdAt = o.createdAt ? new Date(o.createdAt) : new Date()
  const timeStr = createdAt.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const rawTableName = (o.table?.name || o.table?.number || '') as string
  const cleanTableName = rawTableName.replace(/^Mesa\s+/i, '')

  let enc = encoder
    .initialize()
    .codepage('cp858')
    .align('center')
    .bold(true)
    .width(2)
    .height(2)
    .text(escapeText(branding.businessName || 'COMANDA'))
    .newline()
    .width(1)
    .height(1)
    .bold(true)
    .text(escapeText(branding.kitchenHeaderText || 'COMANDA'))
    .newline()
    .bold(true)
    .text('Orden')
    .newline()
    .text(`#${escapeText(o.code || o.id)}`)
    .newline()
    .bold(false)
    .text(timeStr)
    .newline()

  if (branding.kitchenShowTableName && o.serviceType === 'EN_MESA' && cleanTableName) {
    enc = enc.text(`Mesa ${escapeText(cleanTableName)}`).newline()
  } else if (o.serviceType) {
    enc = enc.text(escapeText(o.serviceType)).newline()
  }

  if (branding.kitchenShowCustomerName && o.customerName) {
    enc = enc.text(`Cliente: ${escapeText(o.customerName)}`).newline()
  }

  const kitchenAttendant = o.user?.name || o.collaborator?.user?.name
  if (kitchenAttendant) {
    enc = enc.text(`Atiende: ${escapeText(kitchenAttendant)}`).newline()
  }

  if (o.notes) {
    const noteLines = wrapText(`Notas: ${escapeText(o.notes)}`, columns)
    enc = enc.newline().line('-').align('left')
    for (const noteLine of noteLines) {
      enc = enc.text(noteLine).newline()
    }
  }

  const groups = groupKitchenItems(o.items ?? [])
  for (const group of groups) {
    const label =
      group.station === 'COCINA'
        ? `RONDA ${group.round}`
        : `RONDA ${group.round} (${group.station})`

    enc = enc
      .newline()
      .align('center')
      .line('-')
      .bold(true)
      .text(label)
      .newline()
      .line('-')
      .bold(false)
      .align('left')

    for (const item of group.items) {
      let name = escapeText(
        item.menuItem?.name || item.item?.name || item.menuItemId || 'Item',
      )
      if (item.variantName) name += ` - ${escapeText(item.variantName)}`

      const qtyWidth = 4
      const nameWidth = columns - qtyWidth
      const qtyStr = `${item.quantity}x `.padEnd(qtyWidth, ' ')
      const nameLines = wrapText(name, nameWidth)

      if (nameLines.length === 1) {
        enc = enc.text(`${qtyStr}${nameLines[0].padEnd(nameWidth, ' ')}`).newline()
      } else {
        enc = enc.text(`${qtyStr}${nameLines[0]}`).newline()
        for (let i = 1; i < nameLines.length - 1; i++) {
          enc = enc.text(`${' '.repeat(qtyWidth)}${nameLines[i]}`).newline()
        }
        const lastLine = nameLines[nameLines.length - 1].padEnd(nameWidth, ' ')
        enc = enc.text(`${' '.repeat(qtyWidth)}${lastLine}`).newline()
      }

      if (branding.kitchenShowItemNotes && item.notes) {
        const note = escapeText(item.notes)
        enc = enc.text(`  * ${note.substring(0, columns - 4)}`).newline()
      }
    }
  }

  if (branding.kitchenFooterText) {
    enc = enc.newline().align('center').text(escapeText(branding.kitchenFooterText)).newline()
  }

  return enc.newline().newline().newline().newline().newline().cut().encode()
}
