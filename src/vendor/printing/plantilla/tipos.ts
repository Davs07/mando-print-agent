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
export const DOCUMENT_KINDS = [
  "comanda",
  "precuenta",
  "comprobante",
  "cierre",
  "electronico",
] as const;
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
  // Boleta y factura electrónica (SUNAT)
  | "fiscal_title"
  | "fiscal_customer"
  | "fiscal_totals"
  | "amount_in_words"
  | "payment_method"
  | "sunat_qr"
  | "sunat_hash"
  | "fiscal_status"
  | "fiscal_legend"
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

/**
 * El cliente de un comprobante electrónico. Todo es opcional: una boleta por
 * menos de 700 soles puede emitirse sin identificar al comprador.
 */
export interface ClienteFiscal {
  /**
   * Tipo de documento. Acepta el nombre legible («DNI», «RUC», «CE», «PAS») o
   * el código SUNAT del catálogo 06 («1», «6», «4», «7»): lo que la API guarde.
   * Suele salir del snapshot que se guarda al emitir (`clienteTipoDoc`).
   */
  tipoDoc?: string | null;
  /**
   * Número de documento. `00000000` es el «DNI» que se manda cuando no hay
   * cliente: el paquete lo trata como ausente y no lo imprime. Suele salir de
   * `clienteNumDoc`.
   */
  numDoc?: string | null;
  /** Nombre o razón social. Suele salir de `clienteNombre`. */
  nombre?: string | null;
  /** Dirección. En una factura va impresa; en una boleta casi nunca existe. */
  direccion?: string | null;
}

/**
 * Los datos fiscales de una boleta o factura electrónica, ya emitida.
 *
 * Son NEUTROS, igual que `TicketOrder`: no son el `ElectronicDocument` de
 * `apps/web` ni la respuesta de Factpro. Cada consumidor traduce lo suyo. Los
 * importes aceptan `string` porque los `Decimal` de Prisma llegan así en el
 * JSON de la API; el paquete los coerciona siempre.
 *
 * Qué NO hace el paquete: no calcula IGV ni redondea por su cuenta. Imprime lo
 * que la SUNAT recibió. Una representación impresa que no dice lo mismo que el
 * comprobante enviado es un problema tributario, no de diseño.
 */
export interface DatosFiscales {
  /** `"01"` factura, `"03"` boleta (catálogo 01 de SUNAT). Sale de `tipoDoc`. */
  tipoDoc: "01" | "03";
  /** Serie: `B001`, `F001`. Sale de `serie`. */
  serie: string;
  /**
   * Correlativo. El paquete lo completa a 8 dígitos (`15` → `00000015`), como
   * lo manda SUNAT; si ya viene completo se deja igual. Sale de `correlativo`.
   */
  correlativo: string | number;
  /**
   * Fecha de emisión. Un `AAAA-MM-DD` suelto se toma como día de calendario (no
   * se corre a la víspera por la zona horaria); con hora, se pasa a Lima.
   */
  fechaEmision: string | Date;
  /** El comprador. Sin esto, una boleta sale «PÚBLICO EN GENERAL». */
  cliente?: ClienteFiscal | null;

  /** Operaciones gravadas (base imponible), como las recibió SUNAT. */
  opGravada?: number | string | null;
  /** Operaciones exoneradas. Solo se imprimen si son mayores que 0. */
  opExonerada?: number | string | null;
  /** Operaciones inafectas. Solo se imprimen si son mayores que 0. */
  opInafecta?: number | string | null;
  /**
   * Descuento global. Se imprime como dato (positivo) y NO se resta de nada: la
   * base ya viene calculada. Solo sale si es mayor que 0.
   */
  descuento?: number | string | null;
  /** IGV en importe (no la tasa). Sale de `order.tax` o del documento. */
  igv?: number | string | null;
  /** Tasa de IGV en porcentaje, solo para el rótulo. Por defecto 18. */
  tasaIgv?: number | string | null;
  /** Importe total del comprobante. */
  total: number | string;

  /**
   * El monto en letras («QUINCE CON 00/100 SOLES»). Opcional: si no viene, el
   * paquete lo calcula con `amountToWords`, que es la única implementación.
   */
  montoEnLetras?: string | null;
  /**
   * Moneda del comprobante. Por defecto soles. Decide el símbolo de los
   * importes y la palabra del monto en letras.
   */
  moneda?: "PEN" | "USD" | null;
  /**
   * Cómo se pagó, ya legible («Efectivo», «Yape / Plin»). El paquete no sabe de
   * enums de métodos de pago.
   */
  formaPago?: string | null;
  /** Resumen (digest) de la firma. Sale de `sunatHash`. */
  hash?: string | null;
  /**
   * El CONTENIDO del QR —la cadena de SUNAT con campos separados por `|`
   * (`RUC|tipo|serie|correlativo|IGV|total|fecha|tipoDocCliente|numDocCliente|`)—,
   * NO una imagen ni una URL. Sale de `sunatQr`, y ojo: Factpro a veces
   * devuelve ahí una URL de imagen; eso no es el contenido y no se imprime.
   */
  qr?: string | null;
  /** Estado ya legible: «Aceptada por SUNAT». Sin esto no se imprime estado. */
  estado?: string | null;
  /**
   * Boleta «por consumo»: el detalle se condensa en una sola línea
   * «Por consumo» con la suma, igual que se envió a SUNAT.
   */
  porConsumo?: boolean;
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
  | { kind: "cierre"; cierre: CashCloseData }
  | {
      /** La boleta o factura electrónica. El RUC del emisor sale del branding. */
      kind: "electronico";
      pedido: TicketOrder;
      fiscal: DatosFiscales;
    };

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
  | "Fiscal"
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
   * No se puede ocultar: el aviso de que la precuenta NO es comprobante de pago
   * y lo que SUNAT exige en la representación impresa. Entregarlos de menos es
   * un problema tributario, no de diseño.
   *
   * `true` = en todos los documentos donde el bloque existe; una lista = solo
   * en esos (el RUC del emisor es opcional en una precuenta y obligatorio en
   * una boleta). Para saber si lo es AQUÍ, usar `esObligatorio(type, kind)`:
   * leer este campo a pelo como booleano ignora la lista.
   */
  obligatorio?: boolean | readonly DocumentKind[];
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
