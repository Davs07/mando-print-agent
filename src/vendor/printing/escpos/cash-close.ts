import ReceiptPrinterEncoder, {
  type Encoder,
} from "@point-of-sale/receipt-printer-encoder";

import {
  DEFAULT_RECEIPT_FORMAT,
  leerFormato,
  tamanoDeSeccion,
  type PrintFormatConfig,
} from "../format";
import { columnasDe, type PaperWidth, type TicketBranding } from "../types";
import { plantillaDeFormato, plantillaPorDefecto } from "../plantilla/leer";
import { encodeDocumento } from "../plantilla/motor";
import { escapeText } from "./helpers";

/** Una fila del cierre: concepto a la izquierda, importe a la derecha. */
export interface CashCloseLine {
  label: string;
  total: number;
}

/** Un ingreso o egreso manual de la caja, para el detalle del cierre. */
export interface CashCloseMovement {
  type: "INCOME" | "EXPENSE";
  /** Lo que escribio quien lo registro. Es lo unico que explica el egreso. */
  description: string;
  /** Categoria ya legible («Insumos»), no el enum. */
  category?: string | null;
  amount: number;
  at?: string | null;
}

export interface CashCloseData {
  /**
   * La caja sigue ABIERTA: el papel es un corte, no el cierre. Sale titulado
   * «CORTE DE CAJA», con la hora del corte en vez de la de cierre y sin arqueo
   * (todavia no se conto nada). Que un corte pueda leerse como un cierre es el
   * error que este campo evita: el cajero lo archivaria como el cuadre del dia.
   */
  esCorte?: boolean;
  cashBoxName: string;
  openedByName?: string | null;
  closedByName?: string | null;
  openedAt?: string | null;
  closedAt?: string | null;
  initialAmount: number;
  salesByMethod: CashCloseLine[];
  totalSales?: number | null;
  totalIncome?: number | null;
  totalExpense?: number | null;
  /**
   * Resumen de comandas del turno, una línea por pedido.
   *
   * ⚠️ Sin ítems a propósito. Un papel de 58mm son 32 caracteres: detallar los
   * platos de cada comanda convierte un cierre en metro y medio de papel cada
   * noche. Para cuadrar basta código, mesa y total; el detalle está en pantalla.
   */
  orders?: { code: string; table?: string | null; total: number }[];
  /**
   * Ventas cobradas en EFECTIVO: lo unico de las ventas que entra al cajon.
   * Opcional porque los llamadores viejos no lo mandan; sin el, la cuenta del
   * cajon de la plantilla no enseña la linea de ventas en efectivo (y lo que no
   * suma lo cubre la fila «Ajustes», ver `cash_count`).
   */
  cashSales?: number | null;
  /**
   * Plata metida al cajon A MANO (propinas, sencillo), SIN las ventas.
   *
   * Existe porque `totalIncome` de la API NO sirve para la cuenta del cajon:
   * cada cobro en efectivo crea un movimiento INGRESO/VENTA y el resumen suma
   * todos los INGRESO salvo la apertura, asi que `totalIncome` ya incluye las
   * ventas en efectivo. Sumarlo junto a `cashSales` las contaria dos veces.
   */
  manualIncome?: number | null;
  /**
   * Plata sacada a mano, SIN el ajuste que se crea al cerrar con diferencia
   * (movimiento CIERRE_CAJA): ese tambien entra en `totalExpense`, y contarlo
   * en la cuenta del cajon haria que la diferencia se explicara a si misma.
   */
  manualExpense?: number | null;
  /** Detalle de ingresos y egresos. Solo lo usa la plantilla, si lo muestra. */
  movements?: CashCloseMovement[];
  expectedAmount?: number | null;
  countedAmount?: number | null;
  difference?: number | null;
  currency?: string;
}

export interface CashCloseTicketOptions {
  paperWidth?: PaperWidth;
  format?: string | PrintFormatConfig | null;
  /** Momento de impresión. Se inyecta para que los tests no dependan del reloj. */
  printedAt?: string;
  /**
   * Fuerza el diseño clásico. Ningún llamador real lo usa: existe para que los
   * tests sigan fijando byte a byte el cierre de antes del editor.
   */
  clasico?: boolean;
}

const fechaHora = (d?: string | null) => {
  if (!d) return "-";
  return new Date(d).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Concepto a la izquierda e importe pegado al borde derecho. */
function fila(izq: string, der: string, columns: number): string {
  const hueco = Math.max(1, columns - izq.length - der.length);
  return `${izq}${" ".repeat(hueco)}${der}`;
}

/**
 * Los bytes ESC/POS del cierre de caja.
 *
 * Tercer y último documento térmico que se unifica. Vivía suelto en
 * `apps/web/lib/bluetooth-printing.ts`, así que ni obedecía al panel de diseño
 * ni podía previsualizarse — el negocio lo configuraba todo y este salía como
 * saliera.
 *
 * No usa `sectionOrder`: un cierre no es un ticket de venta con secciones
 * intercambiables, es una cuenta que se lee de arriba abajo y donde mover la
 * diferencia por encima de los totales no describe nada.
 */
export function encodeCashCloseTicket(
  data: CashCloseData,
  branding: TicketBranding,
  options: CashCloseTicketOptions = {},
): Uint8Array {
  /**
   * El cierre SIEMPRE sale con plantilla: la que el negocio guardó en el editor
   * o, si nunca diseñó su cierre, la de fábrica («Con cada egreso»).
   *
   * Por qué el cierre no cae al clásico como la comanda o el comprobante: su
   * clásico no lo configuró nadie —no tenía ni una opción— y su cuenta engaña
   * («Ingresos» suma las ventas en efectivo con lo metido a mano, y el papel no
   * cuadra con el cajón). No hay un diseño que respetar, y sí uno mejor.
   *
   * Va aquí, en el paquete, y no en cada llamador: el panel (Bluetooth, RawBT,
   * WiFi, navegador) y el agente de impresión tienen que sacar el MISMO papel.
   * Una regla así puesta solo en el panel es exactamente la copia que diverge.
   */
  const plantilla = options.clasico
    ? null
    : (plantillaDeFormato(options.format, "cierre") ?? plantillaPorDefecto("cierre"));
  if (plantilla) {
    return encodeDocumento({ kind: "cierre", cierre: data }, branding, {
      paperWidth: options.paperWidth,
      plantilla,
      printedAt: options.printedAt,
    }).bytes;
  }

  const paperWidth = options.paperWidth ?? "80mm";
  const columns = columnasDe(paperWidth);
  const encoder = new ReceiptPrinterEncoder({ language: "esc-pos", columns });

  const fmt = leerFormato(options.format, DEFAULT_RECEIPT_FORMAT);
  const uc = (s: string) => (fmt.uppercase ? s.toUpperCase() : s);
  const eb = (flag?: boolean) => (fmt.extraBold ? true : (flag ?? false));
  const cuerpoTitulo = tamanoDeSeccion(fmt, "header", DEFAULT_RECEIPT_FORMAT);
  const cuerpoTotal = tamanoDeSeccion(fmt, "total", DEFAULT_RECEIPT_FORMAT);

  // Un corte nunca sale titulado «CIERRE»: ver `CashCloseData.esCorte`.
  const tituloDe = data.esCorte ? "CORTE DE CAJA" : "CIERRE DE CAJA";

  const simbolo = data.currency || "S/";
  const money = (n: unknown) => `${simbolo} ${Number(n ?? 0).toFixed(2)}`;

  let enc: Encoder = encoder
    .initialize()
    .codepage("cp858")
    .align("center")
    .bold(eb(fmt.boldBusinessName !== false))
    .width(cuerpoTitulo)
    .height(cuerpoTitulo)
    .text(uc(escapeText(branding.businessName || tituloDe)))
    .newline()
    .width(1)
    .height(1)
    .bold(eb(fmt.boldTitle !== false))
    .text(uc(tituloDe))
    .newline()
    .bold(eb())
    // El separador se emite AUN centrado, como siempre salio. Alinearlo a la
    // izquierda antes cambiaba el aspecto de todos los cierres sin que nadie
    // lo pidiera; migrar no es rediseñar.
    .line("-")
    .align("left");

  enc = enc.text(uc(escapeText(`Caja: ${data.cashBoxName}`))).newline();
  if (data.openedByName) {
    enc = enc.text(uc(escapeText(`Abrio:  ${data.openedByName}`))).newline();
  }
  // Un corte no tiene quien cierre: la caja sigue abierta, y su hora es la del
  // papel, no la de un cierre que todavia no ocurrio.
  if (data.closedByName && !data.esCorte) {
    enc = enc.text(uc(escapeText(`Cerro:  ${data.closedByName}`))).newline();
  }
  enc = enc.text(uc(`Apertura: ${fechaHora(data.openedAt)}`)).newline();
  enc = enc
    .text(
      uc(
        data.esCorte
          ? `Corte:    ${fechaHora(options.printedAt ?? new Date().toISOString())}`
          : `Cierre:   ${fechaHora(data.closedAt)}`,
      ),
    )
    .newline();

  /** Cabecera de bloque: una regla, el título en negrita y otra regla. */
  const bloque = (titulo: string) =>
    (enc = enc
      .align("center")
      .line("-")
      .bold(true)
      .text(uc(titulo))
      .newline()
      .line("-")
      .bold(eb())
      .align("left"));

  if (data.salesByMethod.length > 0) {
    bloque("VENTAS POR METODO");
    for (const m of data.salesByMethod) {
      enc = enc
        .text(fila(uc(escapeText(m.label)), money(m.total), columns))
        .newline();
    }
  }

  enc = enc.align("center").line("-").align("left");
  enc = enc.text(fila(uc("Monto inicial"), money(data.initialAmount), columns)).newline();
  if (data.totalSales != null) {
    enc = enc.text(fila(uc("Total ventas"), money(data.totalSales), columns)).newline();
  }
  if (data.totalIncome != null) {
    enc = enc.text(fila(uc("Ingresos"), money(data.totalIncome), columns)).newline();
  }
  if (data.totalExpense != null) {
    enc = enc
      .text(fila(uc("Egresos"), `-${money(data.totalExpense)}`, columns))
      .newline();
  }

  if (data.orders && data.orders.length > 0) {
    bloque(`COMANDAS (${data.orders.length})`);
    for (const o of data.orders) {
      const etiqueta = o.table ? `${o.code} ${o.table}` : o.code;
      enc = enc
        .text(fila(uc(escapeText(etiqueta)), money(o.total), columns))
        .newline();
    }
  }

  enc = enc.align("center").line("-").align("left");

  /**
   * ⚠️ «A contar (efectivo)», no «Esperado»: este importe excluye tarjeta y pago
   * móvil, que no pasan por el cajón. Llamarlo «Esperado» a secas hacía que el
   * dueño buscara en el cajón una plata que nunca estuvo ahí.
   */
  if (data.expectedAmount != null) {
    enc = enc
      .text(fila(uc("A contar (efectivo)"), money(data.expectedAmount), columns))
      .newline();
  }
  if (data.countedAmount != null) {
    enc = enc.text(fila(uc("Contado"), money(data.countedAmount), columns)).newline();
  }
  if (data.difference != null) {
    const anchoTotal = Math.max(1, Math.floor(columns / cuerpoTotal));
    enc = enc
      .bold(eb(fmt.boldTotal !== false))
      .width(cuerpoTotal)
      .height(cuerpoTotal)
      .text(fila(uc("DIFERENCIA"), money(data.difference), anchoTotal))
      .newline()
      .width(1)
      .height(1)
      .bold(eb());
  }

  return enc
    .align("center")
    .line("-")
    .text(uc(`Impreso: ${fechaHora(options.printedAt ?? new Date().toISOString())}`))
    .newline()
    .newline()
    .newline()
    .newline()
    .cut()
    .encode();
}
