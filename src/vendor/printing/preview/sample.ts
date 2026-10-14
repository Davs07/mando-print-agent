import type { CashCloseData } from "../escpos/cash-close";
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
  subtotal: 138,
  total: 138,
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

/**
 * El cierre de caja de muestra.
 *
 * Con diferencia NEGATIVA a propósito: es el caso que el dueño mira de verdad
 * —falta plata en el cajón— y el que conviene ver bien maquetado antes de que
 * pase en serio.
 *
 * Los números son coherentes con lo que la API entrega: `totalIncome` incluye
 * las ventas en efectivo (`cashSales`) más lo metido a mano, y
 * `expectedAmount` = inicial + ventas en efectivo + ingresos a mano − egresos
 * a mano. Si no cuadraran, la cuenta impresa tendría que inventar una fila de
 * «Ajustes» para sumar.
 */
export const CIERRE_DE_MUESTRA: CashCloseData = {
  cashBoxName: "Caja principal",
  openedByName: "Rodrigo",
  closedByName: "Rodrigo",
  openedAt: "2026-08-27T17:00:00.000Z",
  closedAt: "2026-08-28T04:00:00.000Z",
  initialAmount: 100,
  salesByMethod: [
    { label: "Efectivo", total: 640 },
    { label: "Yape", total: 310 },
    { label: "Tarjeta", total: 180 },
  ],
  totalSales: 1130,
  cashSales: 640,
  manualIncome: 20,
  manualExpense: 45,
  totalIncome: 660,
  totalExpense: 45,
  movements: [
    {
      type: "INCOME",
      description: "Propina compartida",
      category: "Propinas",
      amount: 20,
      at: "2026-08-28T01:10:00.000Z",
    },
    {
      type: "EXPENSE",
      description: "Hielo",
      category: "Insumos",
      amount: 15,
      at: "2026-08-27T22:05:00.000Z",
    },
    {
      type: "EXPENSE",
      description: "Balon de gas",
      category: "Servicios",
      amount: 30,
      at: "2026-08-27T23:30:00.000Z",
    },
  ],
  orders: [
    { code: "20260827-012", table: "Mesa 3", total: 74 },
    { code: "20260827-013", table: "Mesa 1", total: 122 },
    { code: "20260827-014", table: "Mesa 6", total: 138 },
  ],
  expectedAmount: 715,
  countedAmount: 710,
  difference: -5,
};
