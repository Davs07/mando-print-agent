/**
 * `@mando/printing` — cómo se ve un ticket de Mando, en un solo sitio.
 *
 * POR QUÉ EXISTE: el mismo ticket se dibujaba en varios sitios a la vez —el
 * panel para Bluetooth/RawBT/WiFi, el agente de impresión (que es OTRO
 * repositorio), el móvil y el PDF— y las copias se desincronizaban en silencio.
 * Casos reales, no hipotéticos: el tamaño de letra de la comanda se corrigió
 * solo en el agente y por los demás caminos siguió saliendo chico; el orden de
 * secciones que el negocio configuraba no lo leía ningún renderizador.
 *
 * El encoder ESC/POS es JS puro: corre igual en el navegador, en Node y en
 * Hermes. Lo único que cambia entre caminos es el TRANSPORTE —Bluetooth, el
 * agente por websocket, el intent de RawBT—, y eso se queda fuera de este
 * paquete a propósito.
 *
 * Es también el motor de la vista previa del panel: dibujar el ticket
 * decodificando estos mismos bytes es lo que impide que la pantalla y el papel
 * discrepen.
 */

export * from "./types";
export * from "./format";
export {
  escapeText,
  wrapText,
  groupKitchenItems,
  type KitchenGroup,
} from "./escpos/helpers";
export {
  encodeKitchenTicket,
  type KitchenTicketOptions,
} from "./escpos/kitchen";
export {
  encodeReceiptTicket,
  type ReceiptTicketOptions,
} from "./escpos/receipt";
export {
  encodeElectronicDocumentTicket,
  type ElectronicDocumentTicketOptions,
} from "./escpos/electronic";
export {
  amountToWords,
  correlativoDe,
  numeroFiscal,
  tieneNumeroFiscal,
  tipoDeComprobante,
  TIPOS_DE_COMPROBANTE,
  etiquetaDeTipoDocumento,
  esDocumentoAnonimo,
  contenidoQrSunat,
} from "./fiscal";
export {
  modulosDeQr,
  tamanoDeModuloQr,
  ladoDeQrEnMm,
  MODULO_DE_QR,
  QR_MINIMO_MM,
  PUNTOS_POR_MM,
} from "./escpos/qr";
export {
  encodeCashCloseTicket,
  type CashCloseData,
  type CashCloseLine,
  type CashCloseMovement,
  type CashCloseTicketOptions,
} from "./escpos/cash-close";

// El editor de tickets: plantilla por documento, catalogo de bloques y motor.
export * from "./plantilla";

// Vista previa: el contrario exacto del encoder. Vive aquí para que no pueda
// separarse de lo que realmente se imprime.
export { parseEscPos, type PreviewLine } from "./preview/parse";
export {
  renderTicketLinesHtml,
  renderTicketDocument,
  ticketCss,
  type RenderHtmlOptions,
} from "./preview/render-html";
export {
  PEDIDO_DE_MUESTRA,
  BRANDING_DE_MUESTRA,
  BRANDING_FISCAL_DE_MUESTRA,
  CIERRE_DE_MUESTRA,
} from "./preview/sample";
