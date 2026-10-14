/**
 * De «Formato avanzado» a plantilla.
 *
 * POR QUÉ EXISTE: el negocio que abre el editor por primera vez ya tiene un
 * ticket configurado —orden de secciones, cuerpos, negritas, textos de cabecera
 * y pie, qué datos se muestran— y NO debe encontrarse con otro. Esta traducción
 * le da una plantilla que enseña los mismos datos, en el mismo orden y con los
 * mismos cuerpos.
 *
 * No es idéntica byte a byte al clásico, y a propósito: los separadores pasan a
 * ser reglas de lado a lado (el clásico dibujaba un guion suelto), el tipo de
 * servicio sale en palabras («Para llevar», no `PARA_LLEVAR`), y «Orden» y su
 * número van en una línea. Lo que no cambia es QUÉ se ve y en QUÉ orden.
 *
 * Nunca lanza: `leerFormato` ya tolera cualquier cosa, y todo lo demás es
 * armar objetos.
 */

import {
  DEFAULT_KITCHEN_FORMAT,
  DEFAULT_RECEIPT_FORMAT,
  leerFormato,
  seccionesOrdenadas,
  tamanoDeSeccion,
  type PrintFormatConfig,
  type PrintSectionKey,
} from "../format";
import type { TicketBranding } from "../types";
import { DEFINICIONES } from "./catalogo";
import { leerPlantilla } from "./leer";
import type {
  BlockSize,
  BlockType,
  DocumentKind,
  TemplateBlock,
  TicketTemplate,
} from "./tipos";

/** 1× → Normal, 2× → Grande, 3× o más → Enorme: lo que la interfaz clásica ofrecía. */
const CUERPO: Record<number, BlockSize> = { 1: "normal", 2: "large", 3: "huge" };
const tamano = (n: number): BlockSize => CUERPO[Math.min(3, Math.max(1, n))] ?? "normal";

type Semilla = Omit<TemplateBlock, "id" | "type" | "visible"> & { visible?: boolean };

/** Arma la lista de bloques con ids deterministas, como `plantillaPorDefecto`. */
function constructor() {
  const cuenta = new Map<BlockType, number>();
  const blocks: TemplateBlock[] = [];
  return {
    blocks,
    poner(type: BlockType, resto: Semilla = {}) {
      const n = (cuenta.get(type) ?? 0) + 1;
      cuenta.set(type, n);
      blocks.push({
        id: DEFINICIONES[type].repetible ? `${type}-${n}` : type,
        type,
        ...resto,
        visible: resto.visible ?? true,
      });
    },
  };
}

export function plantillaDesdeFormato(
  kind: DocumentKind,
  formato: string | PrintFormatConfig | null | undefined,
  branding: TicketBranding,
): TicketTemplate {
  const b = branding ?? {};
  const porDefecto = kind === "comanda" ? DEFAULT_KITCHEN_FORMAT : DEFAULT_RECEIPT_FORMAT;
  const fmt = leerFormato(formato, porDefecto);
  const cuerpo = (k: PrintSectionKey) => tamano(tamanoDeSeccion(fmt, k, porDefecto));
  /** La negrita de una sección: «false» solo si el negocio la apagó. */
  const encendida = (flag: boolean | undefined) => flag !== false;

  const { blocks, poner } = constructor();

  if (kind === "comanda") {
    const secciones: Record<PrintSectionKey, () => void> = {
      logo: () => {},
      header: () => {
        poner("business_name", {
          size: cuerpo("header"),
          bold: encendida(fmt.boldBusinessName),
          align: "center",
        });
        poner("title", {
          text: b.kitchenHeaderText || "COMANDA",
          bold: encendida(fmt.boldTitle),
          align: "center",
        });
      },
      order_info: () =>
        poner("order_number", {
          label: "Orden",
          size: cuerpo("order_info"),
          bold: encendida(fmt.boldOrderNumber),
          align: "center",
        }),
      meta: () => {
        const s = cuerpo("meta");
        poner("date", { size: s, align: "center", options: { format: "time" } });
        poner("table_service", { size: s, align: "center" });
        poner("customer", {
          label: "Cliente",
          size: s,
          align: "center",
          visible: !!b.kitchenShowCustomerName,
        });
        poner("attendant", { label: "Atiende", size: s, align: "center" });
      },
      notes: () =>
        poner("order_notes", {
          label: "Notas",
          size: cuerpo("notes"),
          bold: fmt.boldOrderNotes === true,
        }),
      items: () =>
        poner("items", {
          size: cuerpo("items"),
          bold: encendida(fmt.boldItemNames),
          options: { showItemNotes: !!b.kitchenShowItemNotes, showRoundHeader: true },
        }),
      // Una comanda no cobra.
      total: () => {},
      footer: () => {
        if (!b.kitchenFooterText) return;
        poner("text", {
          text: b.kitchenFooterText,
          size: cuerpo("footer"),
          bold: fmt.boldCustomText === true,
          align: "center",
        });
      },
    };
    for (const k of seccionesOrdenadas(fmt, DEFAULT_KITCHEN_FORMAT.sectionOrder!)) secciones[k]();
  } else if (kind === "cierre") {
    // El cierre clásico no tiene secciones intercambiables: es una cuenta que
    // se lee de arriba abajo. Solo respeta el cuerpo del nombre y el del
    // resultado, y las mismas negritas.
    poner("business_name", {
      size: cuerpo("header"),
      bold: encendida(fmt.boldBusinessName),
      align: "center",
    });
    poner("title", { text: "CIERRE DE CAJA", bold: encendida(fmt.boldTitle), align: "center" });
    poner("separator", { options: { style: "dashes" } });
    poner("cash_box", { label: "Caja" });
    poner("opening", { label: "Apertura" });
    poner("closing", { label: "Cierre" });
    poner("separator", { options: { style: "dashes" } });
    poner("sales_by_method", { label: "VENTAS POR METODO", options: { showTotal: true } });
    poner("separator", { options: { style: "dashes" } });
    poner("movements", { visible: false });
    poner("cash_count", { label: "", options: { showSigns: true } });
    poner("separator", { options: { style: "dashes" } });
    poner("result", {
      size: cuerpo("total"),
      bold: encendida(fmt.boldTotal),
      align: "center",
      options: { style: "difference" },
    });
    poner("separator", { options: { style: "dashes" } });
    poner("orders_list", { options: { mode: "list" } });
    poner("separator", { options: { style: "dashes" } });
    poner("printed_at", { label: "Impreso", align: "center" });
    poner("signature", { visible: false });
  } else {
    const preventa = kind === "precuenta";
    const secciones: Record<PrintSectionKey, () => void> = {
      logo: () => {},
      header: () => {
        poner("business_name", {
          size: cuerpo("header"),
          bold: encendida(fmt.boldBusinessName),
          align: "center",
        });
        poner("title", {
          text: preventa ? "** PREVENTA **" : "TICKET DE VENTA",
          bold: true,
          align: "center",
          visible: preventa,
        });
        if (b.receiptHeaderText) {
          poner("text", {
            text: b.receiptHeaderText,
            bold: fmt.boldCustomText === true,
            align: "center",
          });
        }
      },
      order_info: () => {
        const s = cuerpo("order_info");
        poner("order_number", {
          label: "Orden",
          size: s,
          bold: fmt.boldOrderNumber === true,
          align: "center",
        });
        poner("date", { label: "Fecha", size: s, align: "center" });
      },
      meta: () => {
        const s = cuerpo("meta");
        poner("address", { size: s, align: "center" });
        poner("phone", { label: "Tel", size: s, align: "center" });
        poner("business_document", { label: "Doc", size: s, align: "center" });
        poner("table_service", { size: s, align: "center" });
        poner("customer", {
          label: "Cliente",
          size: s,
          align: "center",
          visible: !!b.receiptShowCustomerName,
        });
        poner("electronic_document", { size: s, align: "center", visible: !preventa });
        poner("attendant", { label: "Atiende", size: s, align: "center" });
      },
      items: () => {
        poner("separator", { options: { style: "dashes" } });
        poner("items", {
          size: cuerpo("items"),
          bold: fmt.boldItemNames === true,
          options: { showItemNotes: !!b.receiptShowItemNotes, showUnitPrice: false },
        });
      },
      notes: () =>
        poner("order_notes", {
          label: "Notas",
          bold: fmt.boldOrderNotes === true,
          visible: !!b.receiptShowOrderNotes,
        }),
      total: () => {
        poner("separator", { options: { style: "dashes" } });
        // El clásico nunca desglosó: se dejan, apagados, para que el editor
        // los ofrezca sin cambiarle el ticket.
        poner("subtotal", { label: "Subtotal", visible: false });
        poner("discount", { label: "Descuento", visible: false });
        poner("tax", { label: "IGV", visible: false });
        poner("total", {
          label: "TOTAL",
          size: cuerpo("total"),
          bold: encendida(fmt.boldTotal),
          align: "right",
        });
        if (preventa) {
          poner("legal_notice", {
            text: "PREVENTA\nNo es comprobante de pago",
            bold: true,
            align: "center",
          });
        }
      },
      footer: () =>
        poner("text", {
          text: b.receiptFooterText || "Gracias por su preferencia.",
          size: cuerpo("footer"),
          bold: fmt.boldCustomText === true,
          align: "center",
        }),
    };
    for (const k of seccionesOrdenadas(fmt, DEFAULT_RECEIPT_FORMAT.sectionOrder!)) secciones[k]();
  }

  const plantilla: TicketTemplate = {
    version: 2,
    blocks,
    uppercase: fmt.uppercase === true,
    extraBold: fmt.extraBold === true,
  };
  // Pasa por el lector para que complete lo que el clásico no conocía (con su
  // visibilidad de fábrica) y deje la plantilla tal como el editor la guardaría.
  return leerPlantilla(plantilla, kind) ?? plantilla;
}
