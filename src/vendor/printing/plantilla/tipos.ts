/**
 * La plantilla de un ticket: qué datos salen, en qué orden y cómo.
 *
 * POR QUÉ EXISTE, si ya había «Formato avanzado»: aquel mueve OCHO secciones en
 * bloque. No puede quitar el número de orden de la comanda sin llevarse el
 * resto de `order_info`, ni llamar «WSP» al teléfono, ni achicar solo la hora —
 * que es exactamente lo que pide un negocio cuando mira su ticket en papel. La
 * plantilla baja al dato: cada bloque es una cosa que se lee en el ticket.
 *
 * Las claves van en inglés porque se GUARDAN: viven dentro del mismo JSON que
 * `sectionOrder` y `boldTotal`, y mezclar idiomas en un dato persistido se paga
 * en cada migración.
 */

import type { CashCloseData } from "../escpos/cash-close";
import type { TicketOrder } from "../types";

/** Los documentos que se diseñan. Cada uno tiene su propia plantilla. */
export const DOCUMENT_KINDS = ["comanda", "precuenta", "comprobante", "cierre"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

/**
 * Los cuerpos que una térmica puede dar de verdad.
 *
 * No hay puntos ni píxeles: el hardware ofrece dos fuentes y multiplicadores
 * ENTEROS de ancho y de alto por separado. Un control de «14pt» sería una
 * promesa que la impresora redondearía a su manera. Ver `TAMANOS`.
 */
export type BlockSize = "small" | "normal" | "tall" | "wide" | "large" | "huge";

export type BlockAlign = "left" | "center" | "right";

export type BlockType =
  // Comunes a todos los documentos
  | "business_name"
  | "title"
  | "text"
  | "separator"
  // Datos del negocio
  | "address"
  | "phone"
  | "business_document"
  // Datos del pedido
  | "order_number"
  | "date"
  | "table_service"
  | "customer"
  | "attendant"
  | "order_notes"
  | "items"
  | "subtotal"
  | "discount"
  | "tax"
  | "total"
  | "electronic_document"
  | "legal_notice"
  // Cierre de caja
  | "cash_box"
  | "opening"
  | "closing"
  | "sales_by_method"
  | "movements"
  | "cash_count"
  | "result"
  | "orders_list"
  | "printed_at"
  | "signature";

export type BlockOptionValue = boolean | string | number;

export interface TemplateBlock {
  /**
   * Identidad estable DENTRO de la plantilla. Es lo que permite arrastrar,
   * seleccionar y tener dos separadores sin que se confundan; el `type` solo no
   * alcanza porque hay bloques repetibles.
   */
  id: string;
  type: BlockType;
  visible: boolean;
  size?: BlockSize;
  bold?: boolean;
  align?: BlockAlign;
  /** Lo que antecede al dato: «Tel», «WSP», «Atiende». Vacío = el dato solo. */
  label?: string;
  /** Texto propio: el del bloque `text`, el del título, el aviso legal. */
  text?: string;
  /** Opciones propias del tipo. Las válidas están en el catálogo. */
  options?: Record<string, BlockOptionValue>;
}

export interface TicketTemplate {
  /**
   * `2` porque la «versión 1» es «Formato avanzado». Sirve para distinguir una
   * plantilla de cualquier otro objeto que alguien haya dejado en ese JSON.
   */
  version: 2;
  blocks: TemplateBlock[];
  uppercase?: boolean;
  /** Sube todo a negrita, para impresoras que salen muy claras. */
  extraBold?: boolean;
}

/** Lo que hace falta para dibujar un documento, según cuál sea. */
export type DatosDocumento =
  | {
      kind: "comanda" | "precuenta" | "comprobante";
      pedido: TicketOrder;
      /** Comprobante electrónico ya emitido, si lo hay. */
      documento?: {
        documentLabel?: string | null;
        documentNumber?: string | null;
        documentStatus?: string | null;
      } | null;
    }
  | { kind: "cierre"; cierre: CashCloseData };

// ─── Catálogo: qué se le puede ofrecer al usuario ───────────────────────────

export interface DefinicionOpcion {
  key: string;
  label: string;
  ayuda?: string;
  tipo: "boolean" | "select";
  /** Solo para `select`. */
  opciones?: { value: string; label: string }[];
  porDefecto: BlockOptionValue;
  /** Documentos donde la opción tiene sentido. Sin esto, en todos. */
  solo?: DocumentKind[];
}

export type GrupoBloque =
  | "Encabezado"
  | "Negocio"
  | "Pedido"
  | "Platos"
  | "Importes"
  | "Caja"
  | "Extras";

export interface DefinicionBloque {
  type: BlockType;
  /** Cómo se llama en el editor. */
  nombre: string;
  /** Qué imprime, en una frase: es lo que lee quien no sabe qué es el bloque. */
  descripcion: string;
  grupo: GrupoBloque;
  /** Puede haber varios, y el usuario los agrega y los quita. */
  repetible?: boolean;
  /**
   * No se puede ocultar. Hoy solo el aviso de que la precuenta NO es
   * comprobante de pago: entregarla como si lo fuera es un problema tributario,
   * no de diseño.
   */
  obligatorio?: boolean;
  /** Qué controles tiene sentido enseñar para este bloque. */
  admite: {
    size?: boolean;
    bold?: boolean;
    align?: boolean;
    label?: boolean;
    text?: boolean;
  };
  opciones?: DefinicionOpcion[];
}
