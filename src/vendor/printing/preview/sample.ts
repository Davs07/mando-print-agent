import type { TicketBranding, TicketOrder } from "../types";

/**
 * El pedido que se dibuja en la vista previa del panel.
 *
 * Vive en el paquete y no en la pantalla de ajustes a propósito: así el editor
 * y los tests enseñan exactamente lo mismo, y cualquiera que cambie el
 * renderizador ve al instante qué se rompe.
 *
 * Está elegido para que se note el trabajo del renderizador, no para quedar
 * bonito: un plato de nombre largo (obliga a partir la línea a doble ancho, que
 * es donde más fallan los cortes), uno con nota, una nota del pedido entera, y
 * cantidades de más de una cifra.
 */
export const PEDIDO_DE_MUESTRA: TicketOrder = {
  id: "vista-previa",
  code: "20260827-014",
  createdAt: "2026-08-27T18:32:00.000Z",
  serviceType: "EN_MESA",
  tableName: "Mesa 6",
  customerName: "Aldomar Bermeo",
  attendantName: "Rodrigo",
  notes: "Cliente con prisa, sale a las 19:00",
  items: [
    {
      quantity: 2,
      name: "Ceviche mixto",
      unitPrice: 25,
      subtotal: 50,
      roundNumber: 1,
    },
    {
      quantity: 1,
      name: "Chicharron de pescado con yuca",
      notes: "sin aji, poca sal",
      unitPrice: 28,
      subtotal: 28,
      roundNumber: 1,
    },
    {
      quantity: 12,
      name: "Chicha morada 1L",
      unitPrice: 5,
      subtotal: 60,
      roundNumber: 1,
    },
  ],
};

/** Branding neutro para la muestra; el panel lo pisa con el del negocio real. */
export const BRANDING_DE_MUESTRA: TicketBranding = {
  businessName: "Don Cevichon",
  kitchenHeaderText: "Comanda",
  kitchenFooterText: "Buen provecho",
  kitchenShowTableName: true,
  kitchenShowItemNotes: true,
  kitchenShowCustomerName: true,
  receiptHeaderText: "",
  receiptFooterText: "Gracias por su visita",
  receiptShowCustomerName: true,
  receiptShowItemNotes: true,
  receiptShowOrderNotes: true,
};
