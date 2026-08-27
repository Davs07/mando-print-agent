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
