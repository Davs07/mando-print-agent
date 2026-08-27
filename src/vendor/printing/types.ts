/**
 * La forma que necesita un ticket para dibujarse, y nada más.
 *
 * DECISIÓN CENTRAL: estos tipos son NEUTROS. No son el `Order` de
 * `apps/web/features/foods/domain`, ni el `Record<string, unknown>` que el
 * agente recibe por websocket, ni el modelo de Prisma. Cada consumidor traduce
 * lo suyo a esto.
 *
 * Es lo que permite que el mismo renderizador sirva al panel, al móvil y al
 * agente. Si el paquete importara el dominio de `apps/web`, el agente —que es
 * otro repositorio— no podría usarlo, y volveríamos a tener dos copias: que es
 * justo el problema que este paquete existe para eliminar.
 *
 * Por lo mismo, todo lo opcional es opcional de verdad: el agente recibe menos
 * campos que el panel, y el ticket tiene que salir igual.
 */

/** Anchos de papel térmico habituales. */
export type PaperWidth = "58mm" | "80mm";

/** Caracteres por línea a cuerpo normal. */
export function columnasDe(paperWidth: PaperWidth): number {
  return paperWidth === "58mm" ? 32 : 48;
}

export interface TicketItem {
  quantity: number | string;
  /** Nombre ya resuelto. El paquete no sabe de menús ni de variantes. */
  name: string;
  variantName?: string | null;
  notes?: string | null;
  /** Ronda del pedido; agrupa los platos que salieron juntos. */
  roundNumber?: number | null;
  /** `CANCELADO` no se imprime. */
  status?: string | null;
  /** Estación que lo prepara: separa cocina de barra. */
  preparationStation?: string | null;
  unitPrice?: number | string | null;
  subtotal?: number | string | null;
}

export interface TicketOrder {
  id?: string;
  code?: string;
  createdAt?: string | Date | null;
  serviceType?: string | null;
  /** Nombre de mesa ya limpio, sin el prefijo «Mesa». */
  tableName?: string | null;
  customerName?: string | null;
  attendantName?: string | null;
  notes?: string | null;
  items: TicketItem[];
}

/** Lo que el negocio configuró sobre qué se enseña y con qué textos. */
export interface TicketBranding {
  businessName?: string | null;
  businessAddress?: string | null;
  businessPhone?: string | null;
  businessDocument?: string | null;
  kitchenHeaderText?: string | null;
  kitchenFooterText?: string | null;
  kitchenShowCustomerName?: boolean;
  kitchenShowTableName?: boolean;
  kitchenShowItemNotes?: boolean;
  receiptHeaderText?: string | null;
  receiptFooterText?: string | null;
  receiptShowCustomerName?: boolean;
  receiptShowItemNotes?: boolean;
  receiptShowOrderNotes?: boolean;
}
