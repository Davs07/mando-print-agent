import ReceiptPrinterEncoder, {
  type Encoder,
} from "@point-of-sale/receipt-printer-encoder";

import {
  DEFAULT_KITCHEN_FORMAT,
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
import { plantillaDeFormato } from "../plantilla/leer";
import { encodeDocumento } from "../plantilla/motor";
import { escapeText, groupKitchenItems, wrapText } from "./helpers";

/** Secciones de la comanda, en su orden por defecto. */
const KITCHEN_SECTIONS = DEFAULT_KITCHEN_FORMAT.sectionOrder as PrintSectionKey[];

export interface KitchenTicketOptions {
  paperWidth?: PaperWidth;
  /** Objeto ya parseado, o el JSON crudo que llega por websocket. */
  format?: string | PrintFormatConfig | null;
}

/**
 * Los bytes ESC/POS de una comanda de cocina.
 *
 * ÚNICA implementación. Antes existían dos idénticas —una en el panel para
 * Bluetooth/RawBT/WiFi y otra en el agente— y se desincronizaban sin avisar: el
 * tamaño de letra se corrigió solo en el agente y por los otros tres caminos
 * siguió saliendo chico; el panel de diseño lo obedecía una y la otra no.
 *
 * También es el motor de la vista previa: el panel puede dibujar el ticket
 * decodificando estos mismos bytes, así que lo que se ve en pantalla no puede
 * discrepar del papel.
 */
export function encodeKitchenTicket(
  order: TicketOrder,
  branding: TicketBranding,
  options: KitchenTicketOptions = {},
): Uint8Array {
  /**
   * Si el negocio diseño este documento en el editor, MANDA su plantilla. Va
   * aquí —y no en cada llamador— para que Bluetooth, RawBT, WiFi y el agente la
   * obedezcan sin tocar ninguno. Sin plantilla, sigue el código de siempre.
   */
  const plantilla = plantillaDeFormato(options.format, "comanda");
  if (plantilla) {
    return encodeDocumento({ kind: "comanda", pedido: order }, branding, {
      paperWidth: options.paperWidth,
      plantilla,
    }).bytes;
  }

  const paperWidth = options.paperWidth ?? "80mm";
  const columns = columnasDe(paperWidth);
  const encoder = new ReceiptPrinterEncoder({ language: "esc-pos", columns });

  const fmt = leerFormato(options.format, DEFAULT_KITCHEN_FORMAT);
  const uc = (s: string) => (fmt.uppercase ? s.toUpperCase() : s);
  const eb = (flag?: boolean) => (fmt.extraBold ? true : (flag ?? false));

  /** El cuerpo que el negocio eligió para una sección, ya validado. */
  const cuerpo = (k: PrintSectionKey) =>
    tamanoDeSeccion(fmt, k, DEFAULT_KITCHEN_FORMAT);

  /**
   * Cuántos caracteres entran por línea a un cuerpo dado.
   *
   * Es la parte que de verdad importa de los tamaños: a 2× entra la mitad y a
   * 3× un tercio. Calcular el corte sobre `columns` sin dividir hace que la
   * impresora parta las palabras por donde le toque — ya pasó una vez cuando el
   * doble ancho estaba fijo.
   */
  const columnasA = (n: number) => Math.max(1, Math.floor(columns / n));

  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const timeStr = createdAt.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mesa = String(order.tableName ?? "").replace(/^Mesa\s+/i, "");

  /**
   * Cada sección es un emisor independiente.
   *
   * ⚠️ Todas fijan su propia alineación al empezar. Es lo que permite
   * reordenarlas desde el panel: si una diera por hecho el `align` que dejó la
   * anterior, cambiar el orden descuadraría el ticket en vez de reordenarlo.
   */
  const secciones: Record<PrintSectionKey, (e: Encoder) => Encoder> = {
    // El ticket térmico no lleva logo: `kitchenShowLogo` es del ticket HTML.
    logo: (e) => e,

    header: (e) =>
      e
        .align("center")
        .bold(eb(fmt.boldBusinessName !== false))
        .width(cuerpo("header"))
        .height(cuerpo("header"))
        .text(uc(escapeText(branding.businessName || "COMANDA")))
        .newline()
        .width(1)
        .height(1)
        .bold(eb(fmt.boldTitle !== false))
        .text(uc(escapeText(branding.kitchenHeaderText || "COMANDA")))
        .newline()
        .bold(eb()),

    order_info: (e) =>
      e
        .align("center")
        .width(cuerpo("order_info"))
        .height(cuerpo("order_info"))
        .bold(eb(fmt.boldTitle !== false))
        .text(uc("Orden"))
        .newline()
        .bold(eb(fmt.boldOrderNumber !== false))
        .text(uc("#" + escapeText(order.code || order.id)))
        .newline()
        .width(1)
        .height(1)
        .bold(eb()),

    meta: (e) => {
      e = e
        .align("center")
        .width(cuerpo("meta"))
        .height(cuerpo("meta"))
        .bold(eb())
        .text(uc(timeStr))
        .newline();

      if (branding.kitchenShowTableName && order.serviceType === "EN_MESA" && mesa) {
        e = e.text(uc("Mesa " + escapeText(mesa))).newline();
      } else if (order.serviceType) {
        e = e.text(uc(escapeText(order.serviceType))).newline();
      }
      if (branding.kitchenShowCustomerName && order.customerName) {
        e = e.text(uc("Cliente: " + escapeText(order.customerName))).newline();
      }
      if (order.attendantName) {
        e = e.text(uc("Atiende: " + escapeText(order.attendantName))).newline();
      }
      return e.width(1).height(1);
    },

    notes: (e) => {
      if (!order.notes) return e;
      e = e
        .newline()
        .align("center")
        .line("-")
        .align("left")
        .width(cuerpo("notes"))
        .height(cuerpo("notes"))
        .bold(eb(fmt.boldOrderNotes));
      const anchoNotas = columnasA(cuerpo("notes"));
      for (const linea of wrapText(uc("Notas: " + escapeText(order.notes)), anchoNotas)) {
        e = e.text(linea).newline();
      }
      return e.width(1).height(1).bold(eb());
    },

    items: (e) => {
      for (const group of groupKitchenItems(order.items)) {
        const label =
          group.station === "COCINA"
            ? "RONDA " + group.round
            : "RONDA " + group.round + " (" + group.station + ")";

        e = e
          .newline()
          .align("center")
          .line("-")
          .bold(true)
          .text(label)
          .newline()
          .line("-")
          .bold(eb())
          .align("left");

        for (const item of group.items) {
          let name = uc(escapeText(item.name || "Item"));
          if (item.variantName) {
            name += " - " + uc(escapeText(item.variantName));
          }

          /**
           * Los platos salen al mismo cuerpo que el nombre del negocio: es lo
           * único que la cocina necesita leer de lejos, porque el ticket se
           * mira colgado y con prisa, no en la mano. Hora, mesa, quién atiende
           * y las notas se quedan en cuerpo normal — son datos de apoyo y
           * agrandarlos solo gasta papel.
           *
           * OJO: a doble ancho entra la MITAD de caracteres por línea, así que
           * el corte se calcula sobre `columns / 2` (24 en 80mm, 16 en 58mm).
           * Con `columns` sin dividir, la impresora parte el nombre por donde
           * le toca.
           */
          const anchoPlatos = columnasA(cuerpo("items"));
          const qtyWidth = 4;
          const nameWidth = Math.max(1, anchoPlatos - qtyWidth);
          const qtyStr = (item.quantity + "x ").padEnd(qtyWidth, " ");
          const nameLines = wrapText(name, nameWidth);

          e = e
            .bold(eb(fmt.boldItemNames !== false))
            .width(cuerpo("items"))
            .height(cuerpo("items"));
          e = e.text(qtyStr + nameLines[0]).newline();
          for (let i = 1; i < nameLines.length; i++) {
            e = e.text(" ".repeat(qtyWidth) + nameLines[i]).newline();
          }
          e = e.width(1).height(1).bold(eb());

          if (branding.kitchenShowItemNotes && item.notes) {
            const note = escapeText(item.notes);
            e = e.text("  * " + note.substring(0, columns - 4)).newline();
          }
        }
      }
      return e;
    },

    // Una comanda no lleva importes: la cocina no cobra.
    total: (e) => e,

    footer: (e) => {
      if (!branding.kitchenFooterText) return e;
      return e
        .newline()
        .align("center")
        .width(cuerpo("footer"))
        .height(cuerpo("footer"))
        .bold(eb(fmt.boldCustomText))
        .text(uc(escapeText(branding.kitchenFooterText)))
        .newline()
        .width(1)
        .height(1)
        .bold(eb());
    },
  };

  let enc = encoder.initialize().codepage("cp858");
  for (const clave of seccionesOrdenadas(fmt, KITCHEN_SECTIONS)) {
    enc = secciones[clave](enc);
  }

  return enc.newline().newline().newline().newline().newline().cut().encode();
}
