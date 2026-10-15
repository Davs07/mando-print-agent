/**
 * Los datos de ejemplo con los que el editor dibuja la vista previa.
 *
 * No están elegidos para quedar bonitos sino para romper el diseño donde más
 * se rompe: nombres largos que obligan a partir línea (sobre todo a doble
 * ancho), cantidades de dos cifras, varias rondas con barra, notas por plato y
 * por pedido, descuento, y cierres que faltan, cuadran o traen un día entero de
 * egresos. Si un diseño se ve bien con todas, se ve bien con cualquiera.
 *
 * Sin tildes ni eñes a propósito: la térmica las imprime según la página de
 * códigos, y lo que se quiere ver aquí es el diseño, no la codificación.
 */

import type { CashCloseData, CashCloseMovement } from "../escpos/cash-close";
import { CIERRE_DE_MUESTRA } from "../preview/sample";
import type { TicketOrder } from "../types";
import type { DatosDocumento, DatosFiscales, DocumentKind } from "./tipos";

export interface MuestraDeDocumento {
  id: string;
  nombre: string;
  datos: DatosDocumento;
}

// ─── Pedidos ────────────────────────────────────────────────────────────────

const ENMESA: TicketOrder = {
  id: "muestra-mesa",
  code: "20261007-027-509528",
  createdAt: "2026-10-08T00:45:00.000Z",
  serviceType: "EN_MESA",
  tableName: "Mesa 6",
  attendantName: "Rodrigo",
  subtotal: 126,
  total: 126,
  items: [
    { quantity: 2, name: "Ceviche mixto", unitPrice: 25, subtotal: 50, roundNumber: 1 },
    {
      quantity: 1,
      name: "Chicharron de pescado con yuca",
      unitPrice: 28,
      subtotal: 28,
      roundNumber: 1,
    },
    { quantity: 2, name: "Chicha morada 1L", unitPrice: 12, subtotal: 24, roundNumber: 1 },
    { quantity: 2, name: "Leche de tigre", unitPrice: 12, subtotal: 24, roundNumber: 1 },
  ],
};

const PARA_LLEVAR: TicketOrder = {
  id: "muestra-llevar",
  code: "20261007-034-730914",
  createdAt: "2026-10-08T01:20:00.000Z",
  serviceType: "PARA_LLEVAR",
  tableName: null,
  attendantName: "Caja",
  subtotal: 615,
  total: 615,
  items: [
    {
      quantity: 3,
      name: "Arroz con mariscos al estilo de la casa con salsa criolla",
      unitPrice: 38,
      subtotal: 114,
      roundNumber: 1,
    },
    {
      quantity: 2,
      name: "Ceviche de pescado fresco con camote y choclo",
      unitPrice: 32,
      subtotal: 64,
      roundNumber: 1,
    },
    {
      quantity: 4,
      name: "Jalea mixta para compartir con yuca frita",
      unitPrice: 55,
      subtotal: 220,
      roundNumber: 1,
    },
    {
      quantity: 2,
      name: "Tiradito de lenguado en crema de aji amarillo",
      unitPrice: 34,
      subtotal: 68,
      roundNumber: 1,
    },
    {
      quantity: 6,
      name: "Chicha morada de la casa en jarra de un litro",
      unitPrice: 14,
      subtotal: 84,
      roundNumber: 1,
    },
    { quantity: 5, name: "Inca Kola personal 500ml", unitPrice: 4, subtotal: 20, roundNumber: 1 },
    {
      quantity: 1,
      name: "Chaufa de mariscos",
      variantName: "porcion familiar",
      unitPrice: 45,
      subtotal: 45,
      roundNumber: 1,
    },
  ],
};

const DOS_RONDAS: TicketOrder = {
  id: "muestra-rondas",
  code: "20261007-031-118270",
  createdAt: "2026-10-08T00:10:00.000Z",
  serviceType: "EN_MESA",
  tableName: "Mesa 12",
  attendantName: "Lucia",
  subtotal: 251,
  total: 251,
  items: [
    { quantity: 2, name: "Ceviche clasico", unitPrice: 28, subtotal: 56, roundNumber: 1 },
    { quantity: 1, name: "Arroz con mariscos", unitPrice: 42, subtotal: 42, roundNumber: 1 },
    {
      quantity: 3,
      name: "Chilcano de pisco",
      unitPrice: 18,
      subtotal: 54,
      roundNumber: 1,
      preparationStation: "BARRA",
    },
    {
      quantity: 2,
      name: "Limonada frozen",
      unitPrice: 10,
      subtotal: 20,
      roundNumber: 1,
      preparationStation: "BARRA",
    },
    // Un plato cancelado: no debe salir en ningun documento.
    {
      quantity: 1,
      name: "Sudado de pescado",
      unitPrice: 36,
      subtotal: 36,
      roundNumber: 1,
      status: "CANCELADO",
    },
    {
      quantity: 1,
      name: "Pulpo al olivo",
      notes: "bien frio",
      unitPrice: 39,
      subtotal: 39,
      roundNumber: 2,
    },
    {
      quantity: 2,
      name: "Pisco sour",
      unitPrice: 20,
      subtotal: 40,
      roundNumber: 2,
      preparationStation: "BARRA",
    },
  ],
};

const CON_NOTAS: TicketOrder = {
  id: "muestra-notas",
  code: "20261007-036-402265",
  createdAt: "2026-10-08T01:55:00.000Z",
  serviceType: "DOMICILIO",
  tableName: null,
  customerName: "Maria Fernanda Quispe Huaman",
  attendantName: "Lucia",
  notes: "Tocar el timbre dos veces. Sin aji en ninguno de los platos: la senora es alergica al mani.",
  subtotal: 153,
  discount: 15.3,
  tax: 21,
  total: 137.7,
  items: [
    {
      quantity: 1,
      name: "Ceviche de conchas negras",
      notes: "sin cebolla",
      unitPrice: 45,
      subtotal: 45,
      roundNumber: 1,
    },
    {
      quantity: 2,
      name: "Lomo saltado",
      notes: "bien cocido, sin aji ni rocoto",
      unitPrice: 38,
      subtotal: 76,
      roundNumber: 1,
    },
    { quantity: 2, name: "Causa limena", unitPrice: 16, subtotal: 32, roundNumber: 1 },
  ],
};

const PEDIDOS: { id: string; nombre: string; pedido: TicketOrder }[] = [
  { id: "mesa", nombre: "Pedido en mesa", pedido: ENMESA },
  { id: "llevar", nombre: "Para llevar, muchos platos", pedido: PARA_LLEVAR },
  { id: "rondas", nombre: "Dos rondas y barra", pedido: DOS_RONDAS },
  { id: "notas", nombre: "Con notas y cliente", pedido: CON_NOTAS },
];

const deDocumento = (kind: "comanda" | "precuenta" | "comprobante") =>
  PEDIDOS.map(
    ({ id, nombre, pedido }): MuestraDeDocumento => ({
      id,
      nombre,
      datos: {
        kind,
        pedido,
        // El comprobante de la mesa ya salio electronico; los demas, no.
        documento:
          kind === "comprobante" && id === "mesa"
            ? {
                documentLabel: "Boleta",
                documentNumber: "B001-00001234",
                documentStatus: "ACEPTADO",
              }
            : null,
      },
    }),
  );

// ─── Boletas y facturas ─────────────────────────────────────────────────────

const HASH_DE_MUESTRA = "Qm1s0Zs7VZ3v5q9Yk2rXc8PdE4A=";

/**
 * Lo fiscal de una muestra. Los importes cuadran: la base más el IGV es el
 * total, y el QR lleva los mismos números que el papel, porque en uno de verdad
 * SUNAT compara el QR contra lo impreso.
 */
function fiscal(
  base: Pick<DatosFiscales, "tipoDoc" | "serie" | "correlativo" | "fechaEmision" | "total"> &
    Partial<DatosFiscales>,
  cuerpoDelQr: string,
): DatosFiscales {
  return {
    formaPago: "Efectivo",
    hash: HASH_DE_MUESTRA,
    estado: "Aceptada por SUNAT",
    qr: `20123456789|${base.tipoDoc}|${base.serie}|${String(base.correlativo).padStart(8, "0")}|${cuerpoDelQr}`,
    ...base,
  };
}

const ELECTRONICAS: MuestraDeDocumento[] = [
  {
    id: "boleta",
    nombre: "Boleta con cliente",
    datos: {
      kind: "electronico",
      pedido: ENMESA,
      // Correlativo sin completar y con hora: ejercita los dos arreglos de SUNAT.
      fiscal: fiscal(
        {
          tipoDoc: "03",
          serie: "B001",
          correlativo: 15,
          fechaEmision: "2026-10-08T00:45:00.000Z",
          cliente: { tipoDoc: "DNI", numDoc: "45123678", nombre: "Maria Fernanda Quispe Huaman" },
          opGravada: 106.78,
          igv: 19.22,
          total: 126,
        },
        "19.22|126.00|2026-10-07|1|45123678|",
      ),
    },
  },
  {
    id: "anonima",
    nombre: "Boleta sin cliente",
    datos: {
      kind: "electronico",
      pedido: PARA_LLEVAR,
      fiscal: fiscal(
        {
          tipoDoc: "03",
          serie: "B001",
          correlativo: "00000016",
          // Un día suelto: no debe correrse a la víspera por la zona horaria.
          fechaEmision: "2026-10-08",
          // El «DNI» que se manda cuando no hay comprador.
          cliente: { tipoDoc: "1", numDoc: "00000000" },
          opGravada: "521.19",
          igv: "93.81",
          total: "615.00",
          formaPago: "Yape / Plin",
        },
        "93.81|615.00|2026-10-08|0|00000000|",
      ),
    },
  },
  {
    id: "factura",
    nombre: "Factura con RUC y dirección",
    datos: {
      kind: "electronico",
      pedido: DOS_RONDAS,
      fiscal: fiscal(
        {
          tipoDoc: "01",
          serie: "F001",
          correlativo: 4,
          fechaEmision: "2026-10-08",
          cliente: {
            tipoDoc: "6",
            numDoc: "20601234567",
            nombre: "Constructora y Servicios Generales Andinos S.A.C.",
            direccion: "Av. Evitamiento Norte 1520, Urb. Los Pinos, Cajamarca, Cajamarca",
          },
          opGravada: 212.71,
          igv: 38.29,
          total: 251,
          formaPago: "Tarjeta",
        },
        "38.29|251.00|2026-10-08|6|20601234567|",
      ),
    },
  },
  {
    id: "consumo",
    nombre: "Boleta por consumo",
    datos: {
      kind: "electronico",
      pedido: ENMESA,
      fiscal: fiscal(
        {
          tipoDoc: "03",
          serie: "B001",
          correlativo: 18,
          fechaEmision: "2026-10-08",
          cliente: { tipoDoc: "DNI", numDoc: "45123678", nombre: "Maria Fernanda Quispe Huaman" },
          opGravada: 106.78,
          igv: 19.22,
          total: 126,
          porConsumo: true,
        },
        "19.22|126.00|2026-10-08|1|45123678|",
      ),
    },
  },
  {
    id: "descuento",
    nombre: "Boleta con descuento",
    datos: {
      kind: "electronico",
      pedido: CON_NOTAS,
      fiscal: fiscal(
        {
          tipoDoc: "03",
          serie: "B001",
          correlativo: 21,
          fechaEmision: "2026-10-08",
          cliente: { tipoDoc: "DNI", numDoc: "45123678", nombre: "Maria Fernanda Quispe Huaman" },
          // La base ya viene neta del descuento, como la recibe SUNAT.
          opGravada: 116.69,
          descuento: 15.3,
          igv: 21.01,
          total: 137.7,
        },
        "21.01|137.70|2026-10-08|1|45123678|",
      ),
    },
  },
];

// ─── Cierres ────────────────────────────────────────────────────────────────

/** Los pedidos del turno, para que la lista tenga el largo de un dia real. */
const ordenesDelTurno = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    code: `20261008-${String(i + 1).padStart(3, "0")}`,
    table: i % 4 === 0 ? null : `Mesa ${(i % 9) + 1}`,
    total: 30 + ((i * 17) % 90),
  }));

const CIERRE_CUADRA: CashCloseData = {
  cashBoxName: "Caja principal",
  openedByName: "Rodrigo",
  closedByName: "Rodrigo",
  openedAt: "2026-10-07T16:00:00.000Z",
  closedAt: "2026-10-08T03:30:00.000Z",
  initialAmount: 50,
  salesByMethod: [
    { label: "Efectivo", total: 480 },
    { label: "Yape", total: 260 },
    { label: "Tarjeta", total: 120 },
  ],
  totalSales: 860,
  cashSales: 480,
  manualIncome: 0,
  manualExpense: 0,
  totalIncome: 480,
  totalExpense: 0,
  movements: [],
  orders: ordenesDelTurno(5),
  expectedAmount: 530,
  countedAmount: 530,
  difference: 0,
};

const EGRESOS: CashCloseMovement[] = [
  { type: "EXPENSE", description: "Hielo", category: "Insumos", amount: 15, at: "2026-10-07T17:05:00.000Z" },
  { type: "EXPENSE", description: "Balon de gas", category: "Servicios", amount: 30, at: "2026-10-07T17:40:00.000Z" },
  { type: "EXPENSE", description: "Limones por saco", category: "Insumos", amount: 42.5, at: "2026-10-07T18:10:00.000Z" },
  { type: "EXPENSE", description: "Pescado fresco del dia, lenguado y conchas", category: "Insumos", amount: 180, at: "2026-10-07T18:45:00.000Z" },
  { type: "EXPENSE", description: "Pasaje del delivery", category: "Transporte", amount: 12, at: "2026-10-07T20:15:00.000Z" },
  { type: "EXPENSE", description: "Bolsas de papel", category: "Insumos", amount: 18, at: "2026-10-07T20:50:00.000Z" },
  { type: "EXPENSE", description: "Pan frances", category: "Insumos", amount: 25, at: "2026-10-07T21:20:00.000Z" },
  { type: "EXPENSE", description: "Verduras del mercado", category: "Insumos", amount: 64.3, at: "2026-10-07T22:00:00.000Z" },
  { type: "EXPENSE", description: "Propina al mozo", category: null, amount: 20, at: "2026-10-07T23:10:00.000Z" },
  { type: "EXPENSE", description: "Detergente y esponjas", category: "Limpieza", amount: 14.2, at: "2026-10-08T00:05:00.000Z" },
  { type: "EXPENSE", description: "Reparacion de la cocina", category: "Mantenimiento", amount: 60, at: "2026-10-08T01:00:00.000Z" },
  { type: "EXPENSE", description: "Cilantro", category: "Insumos", amount: 6, at: "2026-10-08T01:40:00.000Z" },
  { type: "INCOME", description: "Sencillo del banco", category: "Otros", amount: 15, at: "2026-10-07T16:30:00.000Z" },
  { type: "INCOME", description: "Propina compartida", category: "Propinas", amount: 20, at: "2026-10-08T02:00:00.000Z" },
];

// 200 de caja inicial + 1250.50 en efectivo + 35 a mano - 487 de egresos = 998.50.
const CIERRE_CON_EGRESOS: CashCloseData = {
  cashBoxName: "Caja principal",
  openedByName: "Lucia",
  closedByName: "Rodrigo",
  openedAt: "2026-10-07T15:00:00.000Z",
  closedAt: "2026-10-08T04:10:00.000Z",
  initialAmount: 200,
  salesByMethod: [
    { label: "Efectivo", total: 1250.5 },
    { label: "Yape", total: 640 },
    { label: "Tarjeta", total: 410 },
    { label: "Plin", total: 95.5 },
  ],
  totalSales: 2396,
  cashSales: 1250.5,
  manualIncome: 35,
  manualExpense: 487,
  totalIncome: 1285.5,
  totalExpense: 487,
  movements: EGRESOS,
  orders: ordenesDelTurno(27),
  expectedAmount: 998.5,
  countedAmount: 1006,
  difference: 7.5,
};

// Corte con la caja abierta: sin cerrar, sin contar y sin quien cierre.
// 120 de caja inicial + 640 en efectivo + 25 a mano - 85 de egresos = 700.
const CORTE_ABIERTO: CashCloseData = {
  esCorte: true,
  cashBoxName: "Caja principal",
  openedByName: "Lucia",
  openedAt: "2026-10-07T15:00:00.000Z",
  initialAmount: 120,
  salesByMethod: [
    { label: "Efectivo", total: 640 },
    { label: "Yape", total: 310 },
    { label: "Tarjeta", total: 180 },
  ],
  totalSales: 1130,
  cashSales: 640,
  manualIncome: 25,
  manualExpense: 85,
  totalIncome: 665,
  totalExpense: 85,
  movements: [
    { type: "EXPENSE", description: "Hielo", category: "Insumos", amount: 15, at: "2026-10-07T17:05:00.000Z" },
    { type: "EXPENSE", description: "Pescado fresco del dia", category: "Insumos", amount: 70, at: "2026-10-07T18:45:00.000Z" },
    { type: "INCOME", description: "Sencillo del banco", category: "Otros", amount: 25, at: "2026-10-07T16:30:00.000Z" },
  ],
  orders: ordenesDelTurno(12),
  expectedAmount: 700,
};

export const MUESTRAS: Record<DocumentKind, MuestraDeDocumento[]> = {
  comanda: deDocumento("comanda"),
  precuenta: deDocumento("precuenta"),
  comprobante: deDocumento("comprobante"),
  electronico: ELECTRONICAS,
  cierre: [
    { id: "falta", nombre: "Falta plata", datos: { kind: "cierre", cierre: CIERRE_DE_MUESTRA } },
    { id: "cuadra", nombre: "Cuadra", datos: { kind: "cierre", cierre: CIERRE_CUADRA } },
    {
      id: "egresos",
      nombre: "Muchos egresos",
      datos: { kind: "cierre", cierre: CIERRE_CON_EGRESOS },
    },
    {
      id: "corte",
      nombre: "Corte con la caja abierta",
      datos: { kind: "cierre", cierre: CORTE_ABIERTO },
    },
  ],
};
