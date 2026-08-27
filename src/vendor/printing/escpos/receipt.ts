import ReceiptPrinterEncoder, {
  type Encoder,
} from "@point-of-sale/receipt-printer-encoder";

import {
  DEFAULT_RECEIPT_FORMAT,
  leerFormato,
  seccionesOrdenadas,
  tamanoDeSeccion,
  type PrintFormatConfig,
  type PrintSectionKey,
} from "../format";
import {
  columnasDe,
  type PaperWidth,
  type TicketBranding,
  type TicketOrder,
} from "../types";
import { escapeText, wrapText } from "./helpers";

/** Secciones del comprobante, en su orden por defecto. */
const RECEIPT_SECTIONS = DEFAULT_RECEIPT_FORMAT.sectionOrder as PrintSectionKey[];

export interface ReceiptTicketOptions {
  paperWidth?: PaperWidth;
  /** Objeto ya parseado, o el JSON crudo que llega por websocket. */
  format?: string | PrintFormatConfig | null;
  /**
   * Documento de cortesía: lleva el aviso de que NO es comprobante de pago.
   * Importa que se vea: entregarlo como si lo fuera es un problema tributario,
   * no de diseño.
   */
  preventa?: boolean;
  /** Símbolo de moneda. El negocio puede no estar en soles. */
  currency?: string;
  /** Comprobante electrónico ya emitido, si lo hay. */
  document?: {
    documentLabel?: string | null;
    documentNumber?: string | null;
    documentStatus?: string | null;
  } | null;
  /** Nombre a usar si el negocio no tiene uno configurado. */
  storeName?: string;
}

const money = (valor: unknown, simbolo: string) =>
  `${simbolo}${Number(valor ?? 0).toFixed(2)}`;

/**
 * Los bytes ESC/POS de un comprobante de cortesía.
 *
 * ÚNICA implementación, igual que la comanda. Antes vivía por duplicado —una en
 * el panel para Bluetooth/RawBT/WiFi y otra en el agente— y las dos ya habían
 * divergido: la del panel obedecía «Formato avanzado» y la del agente no, y sus
 * fechas y separadores no coincidían.
 */
export function encodeReceiptTicket(
  order: TicketOrder,
  branding: TicketBranding,
  options: ReceiptTicketOptions = {},
): Uint8Array {
  const paperWidth = options.paperWidth ?? "80mm";
  const columns = columnasDe(paperWidth);
  const encoder = new ReceiptPrinterEncoder({ language: "esc-pos", columns });

  const fmt = leerFormato(options.format, DEFAULT_RECEIPT_FORMAT);
  const uc = (s: string) => (fmt.uppercase ? s.toUpperCase() : s);
  const eb = (flag?: boolean) => (fmt.extraBold ? true : (flag ?? false));
  const cuerpo = (k: PrintSectionKey) =>
    tamanoDeSeccion(fmt, k, DEFAULT_RECEIPT_FORMAT);
  const columnasA = (n: number) => Math.max(1, Math.floor(columns / n));

  const simbolo = options.currency ?? "S/";
  const nombre = branding.businessName || options.storeName || "Ticket de Venta";

  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const fecha = createdAt.toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mesa = String(order.tableName ?? "").replace(/^Mesa\s+/i, "");

  /**
   * Cada sección fija su propia alineación al empezar: es lo que permite
   * reordenarlas desde el panel sin que el ticket se descuadre.
   */
  const secciones: Record<PrintSectionKey, (e: Encoder) => Encoder> = {
    // El logo solo existe en el ticket HTML; en térmica sería un mapa de bits.
    logo: (e) => e,

    header: (e) => {
      e = e
        .align("center")
        .bold(eb(fmt.boldBusinessName !== false))
        .width(cuerpo("header"))
        .height(cuerpo("header"))
        .text(uc(escapeText(nombre)))
        .newline()
        .width(1)
        .height(1)
        .bold(eb());

      if (options.preventa) {
        e = e.bold(true).text(uc("** PREVENTA **")).newline().bold(eb());
      }

      if (branding.receiptHeaderText) {
        e = e.bold(eb(fmt.boldCustomText));
        for (const linea of branding.receiptHeaderText.split("\n")) {
          e = e.text(uc(escapeText(linea))).newline();
        }
        e = e.bold(eb());
      }
      return e;
    },

    order_info: (e) =>
      e
        .align("center")
        .width(cuerpo("order_info"))
        .height(cuerpo("order_info"))
        .bold(eb(fmt.boldTitle !== false))
        .text(uc("Orden"))
        .newline()
        .bold(eb(fmt.boldOrderNumber === true))
        .text(uc(`#${escapeText(order.code || order.id)}`))
        .newline()
        .bold(eb())
        .text(uc(`Fecha: ${fecha}`))
        .newline()
        .width(1)
        .height(1),

    meta: (e) => {
      e = e.align("center").width(cuerpo("meta")).height(cuerpo("meta")).bold(eb());
      const ancho = columnasA(cuerpo("meta"));

      if (branding.businessAddress) {
        for (const l of wrapText(uc(escapeText(branding.businessAddress)), ancho)) {
          e = e.text(l).newline();
        }
      }
      if (branding.businessPhone) {
        e = e.text(uc(`Tel: ${escapeText(branding.businessPhone)}`)).newline();
      }
      if (branding.businessDocument) {
        e = e.text(uc(`Doc: ${escapeText(branding.businessDocument)}`)).newline();
      }

      if (order.serviceType === "EN_MESA" && mesa) {
        e = e.text(uc(`Mesa ${escapeText(mesa)}`)).newline();
      } else if (order.serviceType) {
        e = e.text(uc(`Servicio: ${escapeText(order.serviceType)}`)).newline();
      }

      if (branding.receiptShowCustomerName && order.customerName) {
        e = e.text(uc(`Cliente: ${escapeText(order.customerName)}`)).newline();
      }

      const doc = options.document;
      if (doc?.documentNumber) {
        e = e
          .text(
            `${escapeText(doc.documentLabel || "Documento")}: ${escapeText(doc.documentNumber)}`,
          )
          .newline();
        if (doc.documentStatus) {
          e = e.text(`Estado: ${escapeText(doc.documentStatus)}`).newline();
        }
      }

      if (order.attendantName) {
        e = e.text(`Atiende: ${escapeText(order.attendantName)}`).newline();
      }
      return e.width(1).height(1);
    },

    items: (e) => {
      e = e.newline().align("center").line("-").align("left");

      const activos = (order.items ?? []).filter((i) => i.status !== "CANCELADO");
      if (activos.length === 0) {
        return e.text(uc("Sin items")).newline();
      }

      const ancho = columnasA(cuerpo("items"));
      const qtyWidth = 4;
      const priceWidth = Math.min(10, Math.max(6, Math.floor(ancho / 3)));
      const nameWidth = Math.max(1, ancho - qtyWidth - priceWidth);

      for (const item of activos) {
        let name = uc(escapeText(item.name || "Item manual"));
        if (item.variantName) name += ` - ${uc(escapeText(item.variantName))}`;

        const importe = Number(
          item.subtotal ?? Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0),
        );
        const qtyStr = `${item.quantity}x `.padEnd(qtyWidth, " ");
        const precioStr = money(importe, simbolo).padStart(priceWidth, " ");
        const lineas = wrapText(name, nameWidth);

        e = e
          .bold(eb(fmt.boldItemNames !== false))
          .width(cuerpo("items"))
          .height(cuerpo("items"));

        if (lineas.length === 1) {
          e = e.text(`${qtyStr}${lineas[0]!.padEnd(nameWidth, " ")}${precioStr}`).newline();
        } else {
          /**
           * ⚠️ Las continuaciones NO llevan sangría, aunque alinearlas bajo el
           * nombre quedaría mejor: el encoder DESCARTA los espacios iniciales de
           * `.text()`. Ponerlos hacía que la última línea saliera 4 columnas más
           * corta y su precio no cuadrara con los de los demás platos — visible
           * en papel de 58mm, donde casi todo se parte.
           *
           * Así que el precio se ancla al borde derecho rellenando por la
           * izquierda, que es lo único que la impresora respeta.
           */
          e = e.text(`${qtyStr}${lineas[0]}`).newline();
          for (let i = 1; i < lineas.length - 1; i++) {
            e = e.text(`${lineas[i]}`).newline();
          }
          const ultima = lineas[lineas.length - 1]!;
          const relleno = Math.max(0, ancho - priceWidth - ultima.length);
          e = e.text(`${ultima}${" ".repeat(relleno)}${precioStr}`).newline();
        }
        e = e.width(1).height(1).bold(eb());

        if (branding.receiptShowItemNotes && item.notes) {
          const limite = columns - 4;
          let n = escapeText(item.notes);
          if (n.length > limite) n = n.substring(0, limite - 1);
          e = e.text(`    ${n}`).newline();
        }
      }
      return e;
    },

    notes: (e) => {
      if (!branding.receiptShowOrderNotes || !order.notes) return e;
      e = e.align("left").bold(eb(fmt.boldOrderNotes));
      for (const l of wrapText(`Notas: ${escapeText(order.notes)}`, columns)) {
        e = e.text(l).newline();
      }
      return e.bold(eb());
    },

    total: (e) => {
      // El separador va a la izquierda, como siempre salio. `.line("-")` no
      // dibuja una regla sino un guion suelto —defecto conocido de la libreria—
      // y centrarlo aqui habria cambiado el aspecto de todos los comprobantes
      // sin que nadie lo pidiera.
      e = e
        .align("left")
        .line("-")
        .align("right")
        .width(cuerpo("total"))
        .height(cuerpo("total"))
        .bold(eb(fmt.boldTotal !== false))
        // Con espacio tras el simbolo, que es como se ha impreso siempre. Los
        // items van sin el: la inconsistencia viene del codigo original y se
        // conserva a proposito — normalizarla cambiaria el aspecto de todos los
        // comprobantes en una migracion que nadie pidio que cambiara nada.
        .text(`TOTAL: ${simbolo} ${Number(order.total ?? 0).toFixed(2)}`)
        .newline()
        .width(1)
        .height(1)
        .bold(eb())
        .newline()
        .align("center");

      if (options.preventa) {
        e = e
          .bold(true)
          .text(uc("PREVENTA"))
          .newline()
          .text(uc("No es comprobante de pago"))
          .newline()
          .bold(eb())
          .newline();
      }
      return e;
    },

    footer: (e) =>
      e
        .align("center")
        .width(cuerpo("footer"))
        .height(cuerpo("footer"))
        .bold(eb(!!fmt.boldCustomText))
        .text(uc(escapeText(branding.receiptFooterText || "Gracias por su preferencia.")))
        .newline()
        .width(1)
        .height(1)
        .bold(eb()),
  };

  let enc = encoder.initialize().codepage("cp858");
  for (const clave of seccionesOrdenadas(fmt, RECEIPT_SECTIONS)) {
    enc = secciones[clave](enc);
  }

  return enc.newline().newline().newline().newline().cut().encode();
}
