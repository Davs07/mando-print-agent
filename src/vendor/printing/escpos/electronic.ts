import type { PrintFormatConfig } from "../format";
import { tieneNumeroFiscal } from "../fiscal";
import { plantillaDeFormato, plantillaPorDefecto } from "../plantilla/leer";
import { encodeDocumento } from "../plantilla/motor";
import type { DatosFiscales } from "../plantilla/tipos";
import type { PaperWidth, TicketBranding, TicketOrder } from "../types";

export interface ElectronicDocumentTicketOptions {
  paperWidth?: PaperWidth;
  /** El «Formato avanzado» del negocio: de ahí sale su plantilla, si diseñó una. */
  format?: string | PrintFormatConfig | null;
  /** Momento de impresión. Se inyecta para que los tests no dependan del reloj. */
  printedAt?: string;
  /** Símbolo de moneda cuando el comprobante no trae `moneda`. */
  currency?: string;
  /** Nombre a usar si el negocio no tiene uno configurado. */
  storeName?: string;
}

/**
 * Los bytes ESC/POS de una boleta o factura electrónica ya emitida.
 *
 * SIEMPRE sale con plantilla: la que el negocio guardó en el editor o, si nunca
 * diseñó este documento, la de fábrica. No hay camino «clásico» como en la
 * comanda o el comprobante, y no por comodidad: el único diseño anterior era
 * una hoja HTML en `apps/web` que no pasaba por este paquete, y lo que lleva el
 * papel lo manda SUNAT. Va aquí, y no en cada llamador, para que el panel
 * (Bluetooth, RawBT, WiFi, navegador) y el agente de impresión saquen la MISMA
 * boleta: una regla puesta solo en el panel es exactamente la copia que diverge.
 *
 * ⚠️ A diferencia del motor, ESTA función lanza si el comprobante no tiene serie
 * y correlativo. Un papel con título «BOLETA DE VENTA ELECTRÓNICA» y sin número
 * es un comprobante falso en manos del cliente (por eso `printElectronicDocument`
 * tenía su cortafuegos). Lanzar obliga a quien llama a decidir; devolver bytes
 * en blanco lo escondería.
 */
export function encodeElectronicDocumentTicket(
  pedido: TicketOrder,
  fiscal: DatosFiscales,
  branding: TicketBranding,
  options: ElectronicDocumentTicketOptions = {},
): Uint8Array {
  if (!tieneNumeroFiscal(fiscal)) {
    throw new Error(
      "encodeElectronicDocumentTicket: el comprobante no tiene serie y correlativo; no se imprime.",
    );
  }
  const plantilla =
    plantillaDeFormato(options.format, "electronico") ?? deFabricaConPie(branding);

  return encodeDocumento({ kind: "electronico", pedido, fiscal }, branding, {
    paperWidth: options.paperWidth,
    plantilla,
    currency: options.currency,
    storeName: options.storeName,
    printedAt: options.printedAt,
  }).bytes;
}

/**
 * La de fábrica, con el pie que el negocio ya tenía escrito para el comprobante.
 * La hoja HTML de antes lo imprimía, y un negocio que nunca abrió el editor no
 * debe perder su «Gracias por su visita» por cambiar de motor.
 */
function deFabricaConPie(branding: TicketBranding) {
  const plantilla = plantillaPorDefecto("electronico");
  const pie = String(branding?.receiptFooterText ?? "").trim();
  if (!pie) return plantilla;
  const i = plantilla.blocks.findIndex((b) => b.type === "text");
  if (i >= 0) {
    plantilla.blocks[i] = { ...plantilla.blocks[i]!, visible: true, text: pie };
  } else {
    plantilla.blocks.push({ id: "text-pie", type: "text", visible: true, text: pie, align: "center" });
  }
  return plantilla;
}
