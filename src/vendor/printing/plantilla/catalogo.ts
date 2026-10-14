/**
 * El catálogo: qué bloques existen, en qué documentos, con qué opciones y cómo
 * viene cada documento de fábrica.
 *
 * Es DATOS a propósito. El editor del panel se dibuja recorriendo esto —no
 * tiene un formulario escrito por bloque—, así que agregar un dato nuevo al
 * ticket es una entrada aquí más su dibujo en el motor, y el editor lo ofrece
 * solo. Con un formulario a mano por bloque, el editor y el motor habrían
 * empezado a discrepar el primer día.
 */

import type {
  BlockAlign,
  BlockSize,
  BlockType,
  DefinicionBloque,
  DocumentKind,
  TemplateBlock,
} from "./tipos";

/**
 * Los cuerpos, en lo que la impresora entiende.
 *
 * `ancho` es el que manda en el corte de palabras: a 2× entra la mitad de
 * caracteres por línea. `alto` solo estira, no quita columnas — por eso «Alta»
 * es la forma barata de destacar algo sin partirlo en dos líneas.
 *
 * ⚠️ «Pequeña» usa la fuente B de la impresora, que NO es igual en todos los
 * modelos: en unos son 42 columnas en 58mm, en otros no existe y sale la
 * normal. Las demás son `GS ! n`, que respetan todas.
 */
export const TAMANOS: Record<
  BlockSize,
  { nombre: string; ancho: number; alto: number; fuente: "A" | "B" }
> = {
  small: { nombre: "Pequeña", ancho: 1, alto: 1, fuente: "B" },
  normal: { nombre: "Normal", ancho: 1, alto: 1, fuente: "A" },
  tall: { nombre: "Alta", ancho: 1, alto: 2, fuente: "A" },
  wide: { nombre: "Ancha", ancho: 2, alto: 1, fuente: "A" },
  large: { nombre: "Grande", ancho: 2, alto: 2, fuente: "A" },
  huge: { nombre: "Enorme", ancho: 3, alto: 3, fuente: "A" },
};

/** En el orden en que el editor los enseña, de menor a mayor. */
export const TAMANOS_OFRECIDOS: readonly BlockSize[] = [
  "small",
  "normal",
  "tall",
  "wide",
  "large",
  "huge",
];

export const ALINEACIONES: Record<BlockAlign, string> = {
  left: "Izquierda",
  center: "Centro",
  right: "Derecha",
};

/** Estilos del bloque `separator`. */
export const ESTILOS_DE_SEPARADOR = [
  { value: "dashes", label: "Guiones  - - - -" },
  { value: "double", label: "Doble  = = = =" },
  { value: "dots", label: "Puntos  . . . ." },
  { value: "blank", label: "Línea en blanco" },
] as const;

const TODO = { size: true, bold: true, align: true } as const;

/**
 * Una definición por tipo de bloque, compartida por todos los documentos donde
 * aparece. Lo que cambia de un documento a otro —el texto del título, el cuerpo
 * de los platos— está en `ESQUELETOS`, no aquí.
 */
export const DEFINICIONES: Record<BlockType, DefinicionBloque> = {
  // ── Encabezado ──
  business_name: {
    type: "business_name",
    nombre: "Nombre del negocio",
    descripcion: "El nombre con el que el negocio se presenta en el ticket.",
    grupo: "Encabezado",
    admite: TODO,
  },
  title: {
    type: "title",
    nombre: "Título del documento",
    descripcion: "Qué es este papel: COMANDA, PRECUENTA, CIERRE DE CAJA.",
    grupo: "Encabezado",
    admite: { ...TODO, text: true },
  },

  // ── Negocio ──
  address: {
    type: "address",
    nombre: "Dirección",
    descripcion: "La dirección del negocio. Si no hay, no sale.",
    grupo: "Negocio",
    admite: { ...TODO, label: true },
  },
  phone: {
    type: "phone",
    nombre: "Teléfono",
    descripcion: "El teléfono del negocio. La etiqueta se puede cambiar a WSP.",
    grupo: "Negocio",
    admite: { ...TODO, label: true },
  },
  business_document: {
    type: "business_document",
    nombre: "RUC del negocio",
    descripcion: "El documento tributario del negocio. Si no hay, no sale.",
    grupo: "Negocio",
    admite: { ...TODO, label: true },
  },

  // ── Pedido ──
  order_number: {
    type: "order_number",
    nombre: "Número de orden",
    descripcion: "El código del pedido.",
    grupo: "Pedido",
    admite: { ...TODO, label: true },
    opciones: [
      {
        key: "format",
        label: "Cuánto del número",
        ayuda:
          "El código completo lleva la fecha y un sufijo. El corto es solo el número del día.",
        tipo: "select",
        opciones: [
          { value: "full", label: "Completo  #20261008-027-509528" },
          { value: "short", label: "Corto  #027" },
        ],
        porDefecto: "full",
      },
    ],
  },
  date: {
    type: "date",
    nombre: "Fecha y hora",
    descripcion: "Cuándo se creó el pedido.",
    grupo: "Pedido",
    admite: { ...TODO, label: true },
    opciones: [
      {
        key: "format",
        label: "Qué se muestra",
        tipo: "select",
        opciones: [
          { value: "datetime", label: "Fecha y hora" },
          { value: "date", label: "Solo fecha" },
          { value: "time", label: "Solo hora" },
        ],
        porDefecto: "datetime",
      },
      {
        key: "clock",
        label: "Formato de la hora",
        ayuda: "El de 12 horas es el que se dice en el mostrador; el de 24 ocupa menos.",
        tipo: "select",
        opciones: [
          { value: "12", label: "12 horas  4:38 PM" },
          { value: "24", label: "24 horas  16:38" },
        ],
        porDefecto: "12",
      },
    ],
  },
  table_service: {
    type: "table_service",
    nombre: "Mesa o tipo de servicio",
    descripcion: "«Mesa 6» si es en mesa; si no, «Para llevar» o «Delivery».",
    grupo: "Pedido",
    admite: { ...TODO, label: true },
  },
  customer: {
    type: "customer",
    nombre: "Cliente",
    descripcion: "El nombre del cliente, cuando el pedido lo tiene.",
    grupo: "Pedido",
    admite: { ...TODO, label: true },
  },
  attendant: {
    type: "attendant",
    nombre: "Quién atiende",
    descripcion: "El mozo o cajero que tomó el pedido.",
    grupo: "Pedido",
    admite: { ...TODO, label: true },
  },
  order_notes: {
    type: "order_notes",
    nombre: "Notas del pedido",
    descripcion: "La nota general del pedido. Si no hay, no sale.",
    grupo: "Pedido",
    admite: { ...TODO, label: true },
  },

  // ── Platos ──
  items: {
    type: "items",
    nombre: "Platos",
    descripcion: "La lista de lo pedido, con cantidades.",
    grupo: "Platos",
    // Sin `align`: es una tabla, y alinearla a la derecha no describe nada.
    admite: { size: true, bold: true },
    opciones: [
      {
        key: "showItemNotes",
        label: "Notas de cada plato",
        tipo: "boolean",
        porDefecto: true,
      },
      {
        key: "showRoundHeader",
        label: "Encabezado de ronda",
        ayuda: "«RONDA 1», «RONDA 2 (BARRA)». Separa lo que salió junto.",
        tipo: "boolean",
        porDefecto: true,
        solo: ["comanda"],
      },
      {
        key: "showUnitPrice",
        label: "Precio por unidad",
        ayuda: "Añade «c/u S/ 10.00» cuando se piden varios del mismo.",
        tipo: "boolean",
        porDefecto: false,
        solo: ["precuenta", "comprobante"],
      },
    ],
  },

  // ── Importes ──
  subtotal: {
    type: "subtotal",
    nombre: "Subtotal",
    descripcion: "El importe antes de descuentos e impuestos.",
    grupo: "Importes",
    admite: { size: true, bold: true, label: true },
  },
  discount: {
    type: "discount",
    nombre: "Descuento",
    descripcion: "Solo sale cuando el pedido tiene descuento.",
    grupo: "Importes",
    admite: { size: true, bold: true, label: true },
  },
  tax: {
    type: "tax",
    nombre: "Impuesto",
    descripcion: "Solo sale cuando el pedido lo trae desglosado.",
    grupo: "Importes",
    admite: { size: true, bold: true, label: true },
  },
  total: {
    type: "total",
    nombre: "Total",
    descripcion: "Lo que se cobra.",
    grupo: "Importes",
    admite: { ...TODO, label: true },
  },
  electronic_document: {
    type: "electronic_document",
    nombre: "Comprobante electrónico",
    descripcion: "El número de la boleta o factura emitida, y su estado.",
    grupo: "Pedido",
    admite: { ...TODO },
  },
  legal_notice: {
    type: "legal_notice",
    nombre: "Aviso: no es comprobante",
    descripcion:
      "Aclara que la precuenta no es comprobante de pago. No se puede ocultar.",
    grupo: "Importes",
    obligatorio: true,
    admite: { size: true, bold: true, align: true, text: true },
  },

  // ── Cierre de caja ──
  cash_box: {
    type: "cash_box",
    nombre: "Caja",
    descripcion: "El nombre de la caja que se cierra.",
    grupo: "Caja",
    admite: { ...TODO, label: true },
  },
  opening: {
    type: "opening",
    nombre: "Apertura",
    descripcion: "Cuándo se abrió la caja y quién la abrió.",
    grupo: "Caja",
    admite: { size: true, bold: true, label: true },
  },
  closing: {
    type: "closing",
    nombre: "Cierre",
    descripcion: "Cuándo se cerró la caja y quién la cerró.",
    grupo: "Caja",
    admite: { size: true, bold: true, label: true },
  },
  sales_by_method: {
    type: "sales_by_method",
    nombre: "Ventas por método de pago",
    descripcion: "Cuánto entró por efectivo, Yape, tarjeta y los demás.",
    grupo: "Caja",
    admite: { size: true, bold: true, label: true },
    opciones: [
      {
        key: "showTotal",
        label: "Total vendido",
        tipo: "boolean",
        porDefecto: true,
      },
    ],
  },
  movements: {
    type: "movements",
    nombre: "Detalle de egresos e ingresos",
    descripcion: "En qué se fue cada egreso: hora, motivo e importe.",
    grupo: "Caja",
    admite: { size: true, bold: true },
    opciones: [
      { key: "showExpenses", label: "Egresos", tipo: "boolean", porDefecto: true },
      { key: "showIncome", label: "Ingresos", tipo: "boolean", porDefecto: true },
      { key: "showTime", label: "Hora de cada uno", tipo: "boolean", porDefecto: true },
      {
        key: "group",
        label: "Cómo se listan",
        ayuda:
          "Uno por uno gasta una línea por movimiento. Por categoría resume un día con muchos.",
        tipo: "select",
        opciones: [
          { value: "none", label: "Uno por uno" },
          { value: "category", label: "Sumados por categoría" },
        ],
        porDefecto: "none",
      },
    ],
  },
  cash_count: {
    type: "cash_count",
    nombre: "La cuenta del cajón",
    descripcion:
      "Caja inicial, más ventas en efectivo e ingresos, menos egresos: cuánto debe haber, y cuánto se contó.",
    grupo: "Caja",
    admite: { size: true, bold: true, label: true },
    opciones: [
      {
        key: "showSigns",
        label: "Signos + y −",
        ayuda: "Muestra la suma línea por línea en vez de solo los importes.",
        tipo: "boolean",
        porDefecto: true,
      },
    ],
  },
  result: {
    type: "result",
    nombre: "Resultado del arqueo",
    descripcion: "Si el cajón cuadra, y si no, cuánto falta o sobra.",
    grupo: "Caja",
    admite: TODO,
    opciones: [
      {
        key: "style",
        label: "Cómo se dice",
        tipo: "select",
        opciones: [
          { value: "words", label: "Con palabras  FALTA S/ 2.50" },
          { value: "difference", label: "Como diferencia  DIFERENCIA S/ -2.50" },
        ],
        porDefecto: "words",
      },
    ],
  },
  orders_list: {
    type: "orders_list",
    nombre: "Comandas del turno",
    descripcion: "Los pedidos que pasaron por esta caja.",
    grupo: "Caja",
    admite: { size: true, bold: true },
    opciones: [
      {
        key: "mode",
        label: "Cuánto detalle",
        ayuda: "La lista gasta una línea por pedido: es lo que más papel consume.",
        tipo: "select",
        opciones: [
          { value: "count", label: "Solo cuántas fueron" },
          { value: "list", label: "Una línea por pedido" },
        ],
        porDefecto: "count",
      },
    ],
  },
  printed_at: {
    type: "printed_at",
    nombre: "Fecha de impresión",
    descripcion: "Cuándo se imprimió este papel.",
    grupo: "Caja",
    admite: { ...TODO, label: true },
  },
  signature: {
    type: "signature",
    nombre: "Línea de firma",
    descripcion: "Un espacio y una raya para que firme quien cierra.",
    grupo: "Caja",
    admite: { label: true },
  },

  // ── Extras ──
  text: {
    type: "text",
    nombre: "Texto libre",
    descripcion: "Una frase propia: el agradecimiento, la clave del wifi, un aviso.",
    grupo: "Extras",
    repetible: true,
    admite: { ...TODO, text: true },
  },
  separator: {
    type: "separator",
    nombre: "Separador",
    descripcion: "Una raya de lado a lado, o una línea en blanco.",
    grupo: "Extras",
    repetible: true,
    admite: {},
    opciones: [
      {
        key: "style",
        label: "Estilo",
        tipo: "select",
        opciones: ESTILOS_DE_SEPARADOR.map((e) => ({ ...e })),
        porDefecto: "dashes",
      },
    ],
  },
};

/** Qué bloques existen en cada documento. Una comanda no cobra. */
const DE_PEDIDO: BlockType[] = [
  "business_name",
  "title",
  "order_number",
  "date",
  "table_service",
  "customer",
  "attendant",
  "order_notes",
  "items",
  "text",
  "separator",
];
const DE_COBRO: BlockType[] = [
  ...DE_PEDIDO,
  "address",
  "phone",
  "business_document",
  "subtotal",
  "discount",
  "tax",
  "total",
];

export const BLOQUES_DE: Record<DocumentKind, readonly BlockType[]> = {
  comanda: DE_PEDIDO,
  precuenta: [...DE_COBRO, "legal_notice"],
  comprobante: [...DE_COBRO, "electronic_document"],
  cierre: [
    "business_name",
    "title",
    "cash_box",
    "opening",
    "closing",
    "sales_by_method",
    "movements",
    "cash_count",
    "result",
    "orders_list",
    "printed_at",
    "signature",
    "text",
    "separator",
  ],
};

/** Un bloque del esqueleto: el tipo y lo que se aparta del bloque pelado. */
type Semilla = { type: BlockType } & Partial<Omit<TemplateBlock, "id" | "type">>;

const sep = (style: string): Semilla => ({ type: "separator", options: { style } });

/**
 * Cómo viene cada documento de fábrica.
 *
 * El orden importa dos veces: es el del ticket por defecto, y es el que usa
 * `leerPlantilla` para saber DÓNDE meter un bloque que una plantilla guardada
 * todavía no conoce.
 */
export const ESQUELETOS: Record<DocumentKind, readonly Semilla[]> = {
  comanda: [
    { type: "business_name", size: "large", bold: true, align: "center" },
    { type: "title", text: "COMANDA", bold: true, align: "center" },
    { type: "order_number", label: "Orden", bold: true, align: "center" },
    { type: "date", align: "center", options: { format: "time" } },
    { type: "table_service", align: "center" },
    { type: "customer", label: "Cliente", align: "center", visible: false },
    { type: "attendant", label: "Atiende", align: "center" },
    /**
     * Las notas van ANTES que los platos: «cliente con prisa», «alergia al
     * maní» es contexto para todo lo que viene después. Leerla al final, con
     * los platos ya emplatados, no sirve.
     */
    { type: "order_notes", label: "Notas" },
    /**
     * Los platos al doble: es lo único que la cocina lee de lejos, con el
     * ticket colgado. El resto es apoyo y agrandarlo solo gasta papel.
     */
    { type: "items", size: "large", bold: true },
  ],
  precuenta: [
    { type: "business_name", size: "large", bold: true, align: "center" },
    { type: "title", text: "** PREVENTA **", bold: true, align: "center" },
    { type: "order_number", label: "Orden", align: "center" },
    { type: "date", label: "Fecha", align: "center" },
    { type: "address", align: "center" },
    { type: "phone", label: "Tel", align: "center" },
    { type: "business_document", label: "RUC", align: "center" },
    { type: "table_service", align: "center" },
    { type: "customer", label: "Cliente", align: "center" },
    { type: "attendant", label: "Atiende", align: "center" },
    sep("dashes"),
    { type: "items" },
    { type: "order_notes", label: "Notas" },
    sep("dashes"),
    { type: "subtotal", label: "Subtotal", visible: false },
    { type: "discount", label: "Descuento", visible: false },
    { type: "tax", label: "IGV", visible: false },
    { type: "total", label: "TOTAL", bold: true, align: "right" },
    {
      type: "legal_notice",
      text: "PREVENTA\nNo es comprobante de pago",
      bold: true,
      align: "center",
    },
    { type: "text", text: "Gracias por su preferencia.", align: "center" },
  ],
  comprobante: [
    { type: "business_name", size: "large", bold: true, align: "center" },
    { type: "title", text: "TICKET DE VENTA", bold: true, align: "center", visible: false },
    { type: "order_number", label: "Orden", align: "center" },
    { type: "date", label: "Fecha", align: "center" },
    { type: "address", align: "center" },
    { type: "phone", label: "Tel", align: "center" },
    { type: "business_document", label: "RUC", align: "center" },
    { type: "table_service", align: "center" },
    { type: "customer", label: "Cliente", align: "center" },
    { type: "electronic_document", align: "center" },
    { type: "attendant", label: "Atiende", align: "center" },
    sep("dashes"),
    { type: "items" },
    { type: "order_notes", label: "Notas" },
    sep("dashes"),
    { type: "subtotal", label: "Subtotal", visible: false },
    { type: "discount", label: "Descuento", visible: false },
    { type: "tax", label: "IGV", visible: false },
    { type: "total", label: "TOTAL", bold: true, align: "right" },
    { type: "text", text: "Gracias por su preferencia.", align: "center" },
  ],
  /**
   * El cierre es una cuenta que se lee de arriba abajo, en dos preguntas que no
   * hay que mezclar: cuánto se vendió, y si cuadra el cajón. La segunda es solo
   * de efectivo —tarjeta y Yape no pasan por el cajón— y por eso va en su
   * propio bloque, con la suma a la vista.
   */
  cierre: [
    { type: "business_name", size: "large", bold: true, align: "center" },
    { type: "title", text: "CIERRE DE CAJA", bold: true, align: "center" },
    { type: "cash_box", label: "Caja", align: "center" },
    { type: "opening", label: "Abre" },
    { type: "closing", label: "Cierra" },
    sep("double"),
    { type: "sales_by_method", label: "VENTAS DEL TURNO" },
    sep("double"),
    { type: "movements", visible: false },
    // Con el detalle oculto quedan dos reglas seguidas, y el motor las funde.
    sep("double"),
    { type: "cash_count", label: "EFECTIVO EN EL CAJON" },
    sep("double"),
    { type: "result", size: "large", bold: true, align: "center" },
    sep("double"),
    { type: "orders_list", align: "center" },
    { type: "printed_at", label: "Impreso", align: "center" },
    { type: "signature", label: "Firma", visible: false },
  ],
};

/** Cómo se llama cada documento en el editor. */
export const NOMBRE_DE_DOCUMENTO: Record<DocumentKind, string> = {
  comanda: "Comanda",
  precuenta: "Precuenta",
  comprobante: "Comprobante",
  cierre: "Cierre de caja",
};

/** Las opciones de un bloque que aplican en ESTE documento. */
export function opcionesDe(type: BlockType, kind: DocumentKind) {
  return (DEFINICIONES[type].opciones ?? []).filter(
    (o) => !o.solo || o.solo.includes(kind),
  );
}
