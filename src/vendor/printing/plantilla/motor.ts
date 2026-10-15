/**
 * El motor: plantilla + datos → los bytes que recibe la impresora.
 *
 * Recorre los bloques en orden y cada uno escribe sus líneas. No importa los
 * encoders clásicos: ellos son los que llaman a este cuando el negocio tiene
 * una plantilla, así que el motor es la única mano que dibuja ese ticket.
 *
 * TRES COSAS DEL ENCODER QUE SE MIDIERON Y QUE DAN FORMA A TODO LO DE ABAJO
 * (el README del paquete tiene el detalle):
 *
 * 1. `.text()` DESCARTA los espacios iniciales. Por eso nada de aquí depende de
 *    ellos: el relleno (alineación, sangría de una continuación) se emite como
 *    bytes crudos `0x20` DESPUÉS de fijar tamaño y fuente, de modo que cada
 *    espacio mide lo mismo que las letras que acompaña. Con el relleno de la
 *    librería —que sale ANTES de los comandos de tamaño— un texto centrado a
 *    doble ancho o en fuente B se descuadra en papel real.
 *
 * 2. `.line("-")` dibuja un guion suelto, no una regla. Las reglas se escriben
 *    como `"-".repeat(columnas)`. `.rule()` existe pero emite 0xC4, que solo es
 *    «─» en algunas páginas de códigos y que la vista previa pintaría como «Ä».
 *
 * 3. Con la fuente B la librería cuenta 4/3 de columnas (42 en 58mm, 64 en
 *    80mm) y parte el texto ahí. El corte de palabras se calcula sobre esas
 *    columnas, no sobre las del papel a cuerpo normal.
 *
 * NUNCA LANZA. Un ticket que no sale es peor que uno con un bloque de menos:
 * cada bloque se dibuja aislado, y si falla se salta.
 */

import ReceiptPrinterEncoder, {
  type Encoder,
} from "@point-of-sale/receipt-printer-encoder";

import type { CashCloseData, CashCloseMovement } from "../escpos/cash-close";
import { escapeText, groupKitchenItems, wrapText } from "../escpos/helpers";
import { parseEscPos } from "../preview/parse";
import { columnasDe, type PaperWidth, type TicketBranding, type TicketItem, type TicketOrder } from "../types";
import { DEFINICIONES, TAMANOS } from "./catalogo";
import { opcionDeBloque } from "./leer";
import type {
  BlockAlign,
  BlockSize,
  BlockType,
  DatosDocumento,
  DocumentKind,
  TemplateBlock,
  TicketTemplate,
} from "./tipos";

export interface OpcionesDeDocumento {
  paperWidth?: PaperWidth;
  plantilla: TicketTemplate;
  /** Simbolo de moneda. El negocio puede no estar en soles. */
  currency?: string;
  /** Nombre a usar si el negocio no tiene uno configurado. */
  storeName?: string;
  /** Momento de impresion. Se inyecta para que los tests no dependan del reloj. */
  printedAt?: string;
}

export interface DocumentoCodificado {
  bytes: Uint8Array;
  /**
   * A que bloque pertenece cada linea, en el MISMO orden y con la MISMA
   * longitud que devuelve `parseEscPos(bytes)`. Es lo que deja al editor
   * seleccionar un bloque tocando su linea en la vista previa. `null` = linea
   * que no es de ningun bloque (el avance antes del corte).
   */
  bloquePorLinea: (string | null)[];
  /**
   * Los bloques que fallaron y se saltaron (ids). Vacío = el ticket salió
   * entero. El ticket sale igual, pero un bloque saltado en silencio es un dato
   * que falta en el papel, así que queda a la vista para el editor y los tests.
   */
  omitidos: string[];
}

// ─── Medidas ────────────────────────────────────────────────────────────────

type Fuente = "A" | "B";

interface Estilo {
  ancho: number;
  alto: number;
  fuente: Fuente;
  bold: boolean;
}

/**
 * Columnas de una fuente. La B es 4/3 de la A: 32 → 42 y 48 → 64, que es lo que
 * la librería cuenta y lo que dan las térmicas de 203 dpi (9 puntos de ancho
 * frente a 12).
 */
function columnasDeFuente(columnas: number, fuente: Fuente): number {
  return fuente === "B" ? Math.floor((columnas * 4) / 3) : columnas;
}

/**
 * Cuántos caracteres entran por línea a un tamaño dado. Es la cuenta de la que
 * depende el corte de palabras: a 2× de ancho entra la mitad.
 */
export function columnasDeTamano(paperWidth: PaperWidth, size: BlockSize): number {
  const t = TAMANOS[size] ?? TAMANOS.normal;
  return Math.max(
    1,
    Math.floor(columnasDeFuente(columnasDe(paperWidth), t.fuente) / t.ancho),
  );
}

// ─── Texto ──────────────────────────────────────────────────────────────────

/**
 * Los signos tipograficos que se parecen a uno ASCII, por codigo y no escritos
 * tal cual: algunos son invisibles o separadores de linea y romperian el fuente.
 */
const PARECIDOS: [number[], string][] = [
  [[0x2018, 0x2019, 0x201a, 0x2032], "'"],
  [[0x201c, 0x201d, 0x201e, 0x2033], '"'],
  [[0x2013, 0x2014, 0x2212], "-"],
  [[0x2022, 0x00b7], "-"],
  [[0x00bf], "?"],
  [[0x00a1], "!"],
];
const PARECIDO = new Map<number, string>(
  PARECIDOS.flatMap(([codigos, por]) => codigos.map((c): [number, string] => [c, por])),
);

/**
 * Texto seguro para la termica: ASCII imprimible.
 *
 * Quita acentos (como `escapeText`) y ademas lo que NO se puede imprimir bien:
 * los espacios «raros» que Intl mete en las horas, los codigos de control —uno
 * colado en un nombre de plato podria emitir un comando a la impresora— y todo
 * lo que la pagina de codigos no tiene. Se deja solo ASCII porque la vista
 * previa decodifica cada byte como Latin-1, y «¿» en cp858 se veria «¨».
 */
function limpiar(valor: unknown): string {
  if (valor === null || valor === undefined) return "";
  const base = escapeText(
    typeof valor === "string" || typeof valor === "number" ? valor : String(valor),
  );
  let salida = "";
  // `for...of` recorre por punto de codigo: un emoji es UN caracter, no dos.
  for (const ch of base) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x20 && cp <= 0x7e) salida += ch;
    else if (cp === 0x2026) salida += "...";
    else if (PARECIDO.has(cp)) salida += PARECIDO.get(cp);
    // Controles, espacios no separables y los espacios finos de Intl.
    else if (cp < 0x20 || (cp >= 0x7f && cp <= 0xa0) || (cp >= 0x2000 && cp <= 0x200f) ||
      (cp >= 0x2028 && cp <= 0x202f) || cp === 0x205f || cp === 0x3000 || cp === 0xfeff) {
      salida += " ";
    } else salida += "?";
  }
  return salida;
}

/** Número seguro. Los `Decimal` de Prisma llegan como string, y puede venir cualquier cosa. */
const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const redondear = (n: number) => (Math.abs(n) < 0.005 ? 0 : n);

const cantidad = (q: unknown): string => {
  const n = num(q);
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
};

/**
 * Una fila «izquierda … derecha» de EXACTAMENTE hasta `ancho` caracteres, con
 * la derecha pegada al borde. Si no cabe, recorta la izquierda con un «.» al
 * final: el importe es lo que no se puede perder.
 */
function fila(izq: string, der: string, ancho: number, recortar: "izq" | "der" = "izq"): string {
  let a = izq.trimEnd();
  let b = der;
  if (a.length + b.length + 1 > ancho) {
    if (recortar === "izq") {
      const disponible = ancho - b.length - 1;
      a = disponible >= 2 ? `${a.slice(0, disponible - 1).trimEnd()}.` : "";
      if (b.length > ancho) b = b.slice(0, ancho);
    } else {
      const disponible = ancho - a.length - 1;
      b = disponible >= 2 ? `${b.slice(0, disponible - 1)}.` : "";
      if (a.length > ancho) a = a.slice(0, ancho);
    }
  }
  return `${a}${" ".repeat(Math.max(a ? 1 : 0, ancho - a.length - b.length))}${b}`;
}

// ─── Fechas ─────────────────────────────────────────────────────────────────

const ZONA = "America/Lima";

interface Partes {
  dia: string;
  mes: string;
  anio: string;
  hora: string;
  minuto: string;
}

/**
 * La fecha en Lima. El server y los tests corren en UTC y los negocios están en
 * America/Lima (UTC-5, sin horario de verano): formatear con la zona del
 * proceso imprimiría la hora equivocada, y la de la comanda es la que mira la
 * cocina para saber cuánto lleva esperando un plato.
 */
function partesDeFecha(valor: unknown): Partes | null {
  if (valor === null || valor === undefined || valor === "") return null;
  const d = valor instanceof Date ? valor : new Date(valor as string | number);
  if (Number.isNaN(d.getTime())) return null;

  try {
    const mapa: Record<string, string> = {};
    for (const p of new Intl.DateTimeFormat("es-PE", {
      timeZone: ZONA,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(d)) {
      mapa[p.type] = p.value;
    }
    if (mapa.day && mapa.month && mapa.year && mapa.hour && mapa.minute) {
      return {
        dia: mapa.day,
        mes: mapa.month,
        anio: mapa.year,
        hora: mapa.hour === "24" ? "00" : mapa.hour,
        minuto: mapa.minute,
      };
    }
  } catch {
    // Motores sin datos de zonas horarias (Hermes): se cae al desfase fijo.
  }
  // Lima no tiene horario de verano, así que UTC-5 es exacto.
  const l = new Date(d.getTime() - 5 * 3600 * 1000);
  const dos = (n: number) => String(n).padStart(2, "0");
  return {
    dia: dos(l.getUTCDate()),
    mes: dos(l.getUTCMonth() + 1),
    anio: String(l.getUTCFullYear()),
    hora: dos(l.getUTCHours()),
    minuto: dos(l.getUTCMinutes()),
  };
}

const fechaLarga = (p: Partes) => `${p.dia}/${p.mes}/${p.anio}`;
const fechaCorta = (p: Partes) => `${p.dia}/${p.mes}/${p.anio.slice(-2)}`;
const horaDe = (p: Partes) => `${p.hora}:${p.minuto}`;

/**
 * La hora como se dice en el mostrador: «4:38 PM». Compacta a propósito: el
 * «04:38 p. m.» que da Intl son cuatro columnas más, y en 58mm eran justo las
 * que mandaban el «P. M.» solo a la línea siguiente.
 */
const hora12De = (p: Partes) => {
  const h = Number(p.hora) || 0;
  return `${h % 12 || 12}:${p.minuto} ${h >= 12 ? "PM" : "AM"}`;
};

// ─── Servicio ───────────────────────────────────────────────────────────────

/**
 * El tipo de servicio en palabras. Los valores reales del enum
 * (`RestaurantServiceType`) son EN_MESA, PARA_LLEVAR y DOMICILIO; DELIVERY lo
 * escribe el sitio de auditoría de la API y llega de pedidos viejos.
 */
const SERVICIOS: Record<string, string> = {
  EN_MESA: "En mesa",
  PARA_LLEVAR: "Para llevar",
  DOMICILIO: "Domicilio",
  DELIVERY: "Delivery",
};

function humanizarServicio(tipo: string): string {
  const conocido = SERVICIOS[tipo.toUpperCase()];
  if (conocido) return conocido;
  // Un valor que no conocemos se lee igual: «RECOJO_EN_TIENDA» → «Recojo En Tienda».
  return tipo
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

// ─── El papel ───────────────────────────────────────────────────────────────

/**
 * Lo único que habla con la librería.
 *
 * Cada línea se emite ENTERA y de una vez —estilo, relleno, texto, restablecido
 * y salto—, así que un bloque que falle a medias no deja el encoder con un
 * tamaño o una negrita colgando. Además lleva la cuenta de a qué bloque
 * pertenece cada salto de línea, que es lo que lee `bloquePorLinea`.
 */
class Papel {
  private enc: Encoder;
  readonly ids: (string | null)[] = [];
  /** El bloque que está escribiendo ahora. */
  actual: string | null = null;
  /** Una línea empezó y no llegó a su salto: algo lanzó dentro. */
  private abierta = false;

  constructor(readonly columnas: number) {
    this.enc = new ReceiptPrinterEncoder({ language: "esc-pos", columns: columnas })
      .initialize()
      .codepage("cp858");
  }

  /** Caracteres que entran en una línea con este estilo. */
  ancho(est: Estilo): number {
    return Math.max(1, Math.floor(columnasDeFuente(this.columnas, est.fuente) / est.ancho));
  }

  /**
   * Una línea. `sangria` son columnas de este mismo cuerpo a la izquierda; los
   * espacios iniciales del texto cuentan como sangría, porque `.text()` los
   * tiraría y la línea quedaría más corta de lo que el cálculo supone.
   */
  linea(texto: string, est: Estilo, align: BlockAlign = "left", sangria = 0): void {
    const ef = this.ancho(est);
    const inicial = texto.length - texto.trimStart().length;
    let t = texto.slice(inicial).trimEnd();
    let margen = Math.max(0, sangria) + inicial;
    margen = Math.min(margen, ef - 1);
    if (t.length > ef - margen) t = t.slice(0, ef - margen);

    if (align === "center") margen += Math.floor((ef - margen - t.length) / 2);
    else if (align === "right") margen += ef - margen - t.length;

    // Si la línea anterior se quedó a medias (la librería lanzó dentro de ella),
    // se cierra: cambiar de fuente en mitad de una línea lanza otra vez.
    if (this.abierta) this.vacia();

    this.abierta = true;
    let e = this.enc;
    if (est.fuente === "B") e = e.font("B");
    if (est.ancho > 1) e = e.width(est.ancho);
    if (est.alto > 1) e = e.height(est.alto);
    if (est.bold) e = e.bold(true);
    if (margen > 0) e = e.raw(new Array<number>(margen).fill(0x20));
    if (t) e = e.text(t);
    // Tamaño y negrita se restablecen ANTES del salto, que es como los emite la
    // librería igualmente.
    if (est.bold) e = e.bold(false);
    if (est.alto > 1) e = e.height(1);
    if (est.ancho > 1) e = e.width(1);
    e = e.newline();
    // ⚠️ La fuente NO: la librería lanza si se cambia en mitad de una línea
    // («Changing fonts is not supported in the middle of a line»), así que solo
    // se puede devolver a la A DESPUÉS del salto.
    if (est.fuente === "B") e = e.font("A");
    this.enc = e;
    this.abierta = false;
    this.ids.push(this.actual);
  }

  /** Una línea en blanco. */
  vacia(n = 1): void {
    for (let i = 0; i < n; i++) {
      this.enc = this.enc.newline();
      this.abierta = false;
      this.ids.push(this.actual);
    }
  }

  cortar(): void {
    this.enc = this.enc.cut();
  }

  bytes(): Uint8Array {
    return this.enc.encode();
  }
}

// ─── El contexto de un documento ────────────────────────────────────────────

const NORMAL: Estilo = { ancho: 1, alto: 1, fuente: "A", bold: false };

/** Lo razonable por tipo cuando el bloque no dice nada. */
const POR_TIPO: Partial<Record<BlockType, { bold?: boolean; align?: BlockAlign }>> = {
  business_name: { bold: true, align: "center" },
  title: { bold: true, align: "center" },
  text: { align: "center" },
  legal_notice: { bold: true, align: "center" },
  electronic_document: { align: "center" },
  total: { bold: true, align: "right" },
  result: { bold: true, align: "center" },
  signature: {},
};

const PALABRAS: Partial<Record<BlockType, string>> = {
  subtotal: "Subtotal",
  discount: "Descuento",
  tax: "IGV",
  total: "TOTAL",
  opening: "Apertura",
  closing: "Cierre",
  signature: "Firma",
};

interface Ctx {
  papel: Papel;
  kind: DocumentKind;
  branding: TicketBranding;
  opciones: OpcionesDeDocumento;
  plantilla: TicketTemplate;
  simbolo: string;
  datos: DatosDocumento;
}

const columnasPapel = (c: Ctx) => c.papel.columnas;

/** El texto con el que se imprime: limpio, y en mayúsculas si la plantilla lo pide. */
const txt = (c: Ctx, v: unknown) => {
  const s = limpiar(v);
  return c.plantilla.uppercase ? s.toUpperCase() : s;
};

const dinero = (c: Ctx, v: unknown, simbolo = c.simbolo) =>
  `${simbolo} ${redondear(num(v)).toFixed(2)}`;

function estiloDe(c: Ctx, b: TemplateBlock, forzado?: { size?: BlockSize; bold?: boolean }): Estilo {
  const size = forzado?.size ?? (b.size && b.size in TAMANOS ? b.size : "normal");
  const t = TAMANOS[size];
  const bold = forzado?.bold ?? b.bold ?? POR_TIPO[b.type]?.bold ?? false;
  return {
    ancho: t.ancho,
    alto: t.alto,
    fuente: t.fuente,
    bold: c.plantilla.extraBold === true ? true : bold,
  };
}

const alineacionDe = (b: TemplateBlock): BlockAlign =>
  b.align ?? POR_TIPO[b.type]?.align ?? "left";

/** `Etiqueta: dato`, o el dato solo si la etiqueta está vacía. */
const conEtiqueta = (label: string | undefined, dato: string) =>
  label && label.trim() ? `${label.trim()}: ${dato}` : dato;

/**
 * Un párrafo: cada `\n` es un renglón, y cada renglón se parte por palabras a
 * las columnas EFECTIVAS del cuerpo (`floor(columnas / ancho)`), no a las del
 * papel. Es el error que ya costó caro con el doble ancho fijo.
 */
function parrafo(c: Ctx, b: TemplateBlock, texto: string, est = estiloDe(c, b)): void {
  const ef = c.papel.ancho(est);
  const align = alineacionDe(b);
  for (const renglon of texto.split(/\r?\n/)) {
    const limpio = txt(c, renglon);
    if (limpio.trim() === "") {
      c.papel.vacia();
      continue;
    }
    for (const l of wrapText(limpio, ef)) c.papel.linea(l, est, align);
  }
}

/** Una regla de lado a lado, a cuerpo normal. */
function regla(c: Ctx, caracter: string): void {
  c.papel.linea(caracter.repeat(columnasPapel(c)), NORMAL);
}

/**
 * El mayor cuerpo, no más grande que el pedido, en el que el texto cabe en UNA
 * línea. «FALTA S/ 2.50» a doble ancho son 26 columnas: en 58mm no entran, y
 * partirlo en dos renglones deja de ser un resultado que se lee de un vistazo.
 */
function cuerpoQueEntra(c: Ctx, pedido: Estilo, texto: string): Estilo {
  const candidatos = (Object.keys(TAMANOS) as BlockSize[])
    .map((k) => TAMANOS[k])
    .filter((t) => t.ancho <= pedido.ancho && t.alto <= pedido.alto)
    // De mayor a menor; la fuente B va la última porque solo gana columnas.
    .sort(
      (a, b) =>
        b.ancho - a.ancho ||
        b.alto - a.alto ||
        (a.fuente === "A" ? 0 : 1) - (b.fuente === "A" ? 0 : 1),
    );
  for (const t of candidatos) {
    const est = { ...pedido, ancho: t.ancho, alto: t.alto, fuente: t.fuente };
    if (texto.length <= c.papel.ancho(est)) return est;
  }
  return { ...pedido, ancho: 1, alto: 1, fuente: "A" };
}

// ─── Bloques de un pedido ───────────────────────────────────────────────────

const activos = (items: unknown): TicketItem[] =>
  Array.isArray(items) ? (items as TicketItem[]).filter((i) => i && i.status !== "CANCELADO") : [];

function importeDe(item: TicketItem): number {
  if (item.subtotal !== undefined && item.subtotal !== null && item.subtotal !== "") {
    return num(item.subtotal);
  }
  return num(item.unitPrice) * num(item.quantity);
}

/** `AAAAMMDD-NNN-XXXXXX` → `NNN`. Cualquier otra forma se deja completa. */
function codigoCorto(codigo: string): string {
  const m = /^\d{8}-(\d+)-[A-Za-z0-9]+$/.exec(codigo);
  return m ? m[1]! : codigo;
}

function mesaDe(order: TicketOrder): string {
  return String(order.tableName ?? "").replace(/^\s*Mesa\s+/i, "").trim();
}

function bloqueItems(c: Ctx, b: TemplateBlock, order: TicketOrder): void {
  const est = estiloDe(c, b);
  const ef = c.papel.ancho(est);
  const esComanda = c.kind === "comanda";
  const verNotas = opcionDeBloque<boolean>(b, "showItemNotes", c.kind);
  const lista = activos(order.items);

  /** La nota de un plato, bajo él, sangrada y sin pasarse del papel. */
  const nota = (item: TicketItem) => {
    if (!verNotas || !item.notes) return;
    // A cuerpo normal aunque el plato vaya grande: es apoyo, no se lee de lejos.
    const estNota: Estilo = { ...est, ancho: 1, alto: 1 };
    const sangria = 4;
    const renglones = wrapText(txt(c, item.notes), Math.max(1, c.papel.ancho(estNota) - sangria));
    renglones.forEach((r, i) => {
      // En la comanda el primer renglón lleva su viñeta («  * nota»).
      if (esComanda && i === 0) c.papel.linea(`* ${r}`, estNota, "left", 2);
      else c.papel.linea(r, estNota, "left", sangria);
    });
  };

  const nombreDe = (item: TicketItem) => {
    let nombre = txt(c, item.name || (esComanda ? "Item" : "Item manual"));
    if (item.variantName) nombre += ` - ${txt(c, item.variantName)}`;
    return nombre;
  };

  if (esComanda) {
    const grupos = groupKitchenItems(lista);
    const conRonda = opcionDeBloque<boolean>(b, "showRoundHeader", c.kind);
    for (const g of grupos) {
      if (conRonda) {
        const rotulo = g.station === "COCINA" ? `RONDA ${g.round}` : `RONDA ${g.round} (${limpiar(g.station).toUpperCase()})`;
        regla(c, "-");
        c.papel.linea(rotulo, { ...NORMAL, bold: true }, "center");
        regla(c, "-");
      }
      for (const item of g.items) {
        const prefijo = `${cantidad(item.quantity)}x `;
        const renglones = wrapText(nombreDe(item), Math.max(1, ef - prefijo.length));
        // La continuación baja alineada bajo el nombre: la sangría va como
        // bytes crudos porque `.text()` se comería los espacios.
        c.papel.linea(prefijo + renglones[0]!, est);
        for (let i = 1; i < renglones.length; i++) {
          c.papel.linea(renglones[i]!, est, "left", prefijo.length);
        }
        nota(item);
      }
    }
    return;
  }

  if (lista.length === 0) {
    c.papel.linea(txt(c, "Sin items"), est);
    return;
  }

  const verUnidad = opcionDeBloque<boolean>(b, "showUnitPrice", c.kind);
  for (const item of lista) {
    const importe = dinero(c, importeDe(item));
    const prefijo = `${cantidad(item.quantity)}x `;
    const hueco = ef - prefijo.length - importe.length - 1;
    const nombre = nombreDe(item);

    if (hueco < 6) {
      // Cuerpo tan grande que el importe se come la línea: va aparte, a la derecha.
      const renglones = wrapText(nombre, Math.max(1, ef - prefijo.length));
      c.papel.linea(prefijo + renglones[0]!, est);
      for (let i = 1; i < renglones.length; i++) {
        c.papel.linea(renglones[i]!, est, "left", prefijo.length);
      }
      c.papel.linea(importe, est, "right");
    } else {
      const renglones = wrapText(nombre, hueco);
      if (renglones.length === 1) {
        c.papel.linea(fila(prefijo + renglones[0]!, importe, ef), est);
      } else {
        c.papel.linea(prefijo + renglones[0]!, est);
        for (let i = 1; i < renglones.length - 1; i++) {
          c.papel.linea(renglones[i]!, est, "left", prefijo.length);
        }
        // El importe va en el ÚLTIMO renglón, pegado al borde derecho: se
        // rellena por la izquierda del importe, que es lo único que respeta
        // la impresora.
        c.papel.linea(
          fila(renglones[renglones.length - 1]!, importe, ef - prefijo.length),
          est,
          "left",
          prefijo.length,
        );
      }
    }

    if (verUnidad && num(item.quantity) > 1) {
      const unidad = item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice !== ""
        ? num(item.unitPrice)
        : importeDe(item) / num(item.quantity);
      c.papel.linea(`c/u ${dinero(c, unidad)}`, { ...est, bold: false }, "left", prefijo.length);
    }
    nota(item);
  }
}

/** Una fila de importe: «Etiqueta … S/ 10.00». */
function filaDeImporte(c: Ctx, b: TemplateBlock, valor: number): void {
  const est = estiloDe(c, b);
  const etiqueta = b.label === undefined ? (PALABRAS[b.type] ?? "") : b.label;
  const ef = c.papel.ancho(est);
  c.papel.linea(fila(txt(c, etiqueta), dinero(c, valor), ef), est);
}

type DocElectronico = Extract<DatosDocumento, { kind: "comanda" | "precuenta" | "comprobante" }>["documento"];

function bloqueDePedido(c: Ctx, b: TemplateBlock, order: TicketOrder, documento: DocElectronico): void {
  const { branding } = c;
  const dato = (valor: unknown) => {
    const t = limpiar(valor).trim();
    return t === "" ? null : t;
  };
  /** Un dato simple con su etiqueta, partido por palabras. */
  const simple = (valor: unknown) => {
    const d = dato(valor);
    if (d !== null) parrafo(c, b, conEtiqueta(b.label, d));
  };

  switch (b.type) {
    case "business_name": {
      const nombre = dato(branding.businessName) ?? dato(c.opciones.storeName);
      if (nombre !== null) parrafo(c, b, nombre);
      return;
    }
    case "title":
    case "text":
      if (b.text && b.text.trim()) parrafo(c, b, b.text);
      return;
    case "legal_notice": {
      // Obligatorio: si alguien le vació el texto, sale el de fábrica.
      const texto = b.text && b.text.trim() ? b.text : "PREVENTA\nNo es comprobante de pago";
      parrafo(c, b, texto);
      return;
    }
    case "separator": {
      const estilo = opcionDeBloque<string>(b, "style", c.kind);
      if (estilo === "blank") c.papel.vacia();
      else regla(c, estilo === "double" ? "=" : estilo === "dots" ? "." : "-");
      return;
    }
    case "address":
      return simple(branding.businessAddress);
    case "phone":
      return simple(branding.businessPhone);
    case "business_document":
      return simple(branding.businessDocument);
    case "order_number": {
      const codigo = dato(order.code) ?? dato(order.id);
      if (codigo === null) return;
      const forma = opcionDeBloque<string>(b, "format", c.kind) === "short" ? codigoCorto(codigo) : codigo;
      const label = b.label && b.label.trim() ? `${b.label.trim()} ` : "";
      parrafo(c, b, `${label}#${forma}`);
      return;
    }
    case "date": {
      const p = partesDeFecha(order.createdAt ?? c.opciones.printedAt ?? new Date());
      if (!p) return;
      const formato = opcionDeBloque<string>(b, "format", c.kind);
      const hora = opcionDeBloque<string>(b, "clock", c.kind) === "24" ? horaDe(p) : hora12De(p);
      const t = formato === "date" ? fechaLarga(p) : formato === "time" ? hora : `${fechaLarga(p)} ${hora}`;
      parrafo(c, b, conEtiqueta(b.label, t));
      return;
    }
    case "table_service": {
      const mesa = mesaDe(order);
      let t: string | null = null;
      if (order.serviceType === "EN_MESA" && mesa) t = `Mesa ${mesa}`;
      else if (order.serviceType) t = humanizarServicio(String(order.serviceType));
      else if (mesa) t = `Mesa ${mesa}`;
      if (t !== null) parrafo(c, b, conEtiqueta(b.label, t));
      return;
    }
    case "customer":
      return simple(order.customerName);
    case "attendant":
      return simple(order.attendantName);
    case "order_notes":
      return simple(order.notes);
    case "items":
      return bloqueItems(c, b, order);
    case "subtotal": {
      if (order.subtotal === undefined || order.subtotal === null || order.subtotal === "") return;
      return filaDeImporte(c, b, num(order.subtotal));
    }
    case "discount": {
      const d = num(order.discount);
      if (d > 0) filaDeImporte(c, b, -d);
      return;
    }
    case "tax": {
      const t = num(order.tax);
      if (t > 0) filaDeImporte(c, b, t);
      return;
    }
    case "total": {
      const valor = order.total !== undefined && order.total !== null && order.total !== ""
        ? num(order.total)
        : activos(order.items).reduce((s, i) => s + importeDe(i), 0);
      const etiqueta = b.label === undefined ? "TOTAL" : b.label.trim();
      const monto = dinero(c, valor);
      parrafo(c, b, etiqueta ? `${etiqueta}: ${monto}` : monto);
      return;
    }
    case "electronic_document": {
      if (!documento?.documentNumber) return;
      const est = estiloDe(c, b);
      parrafo(c, b, `${limpiar(documento.documentLabel) || "Documento"}: ${limpiar(documento.documentNumber)}`, est);
      if (documento.documentStatus) parrafo(c, b, `Estado: ${limpiar(documento.documentStatus)}`, est);
      return;
    }
    default:
      return;
  }
}

// ─── Bloques del cierre ─────────────────────────────────────────────────────

/** Lo que entra y sale del cajón, calculado una vez para `cash_count` y `result`. */
function cuentaDelCajon(d: CashCloseData) {
  const inicial = num(d.initialAmount);
  const ventas = d.cashSales === undefined || d.cashSales === null ? null : num(d.cashSales);
  const ingresos =
    d.manualIncome !== undefined && d.manualIncome !== null
      ? num(d.manualIncome)
      : ventas !== null
        ? Math.max(0, num(d.totalIncome) - ventas)
        : num(d.totalIncome);
  const egresos =
    d.manualExpense !== undefined && d.manualExpense !== null
      ? num(d.manualExpense)
      : num(d.totalExpense);
  const suma = inicial + (ventas ?? 0) + ingresos - egresos;
  // `expectedAmount` es la fuente de verdad (la calcula la API); la suma solo
  // se usa cuando no viene.
  const tieneEsperado = d.expectedAmount !== undefined && d.expectedAmount !== null;
  const debeHaber = tieneEsperado ? num(d.expectedAmount) : suma;
  const ajuste = tieneEsperado && Math.abs(debeHaber - suma) >= 0.005 ? debeHaber - suma : 0;
  return { inicial, ventas, ingresos, egresos, suma, debeHaber, ajuste };
}

/**
 * El titulo de un corte NO es del diseno: sale siempre, con el tamano, la
 * negrita y la alineacion que el negocio le dio al bloque `title`, pero con
 * este texto. Es como el aviso legal de la precuenta: un corte que se lea como
 * cierre se archiva como el cuadre del dia, y esa confusion no se deja a lo que
 * alguien haya escrito (o borrado) en el editor.
 */
const TITULO_DE_CORTE = "CORTE DE CAJA";
const AVISO_DE_CORTE = "Caja abierta";

function bloqueDeCierre(c: Ctx, b: TemplateBlock, d: CashCloseData): void {
  const { branding } = c;
  const dato = (valor: unknown) => {
    const t = limpiar(valor).trim();
    return t === "" ? null : t;
  };
  const est = estiloDe(c, b);
  const ef = c.papel.ancho(est);
  /** Un título de bloque: en negrita, solo si la etiqueta no está vacía. */
  const titulo = (texto: string) => {
    const t = txt(c, texto).trim();
    if (t) c.papel.linea(t, { ...est, bold: true });
  };

  switch (b.type) {
    case "business_name": {
      const nombre = dato(branding.businessName) ?? dato(c.opciones.storeName);
      if (nombre !== null) parrafo(c, b, nombre);
      return;
    }
    case "title":
      if (d.esCorte) {
        // El texto guardado se ignora: ver `TITULO_DE_CORTE`.
        parrafo(c, b, TITULO_DE_CORTE);
        parrafo(c, b, AVISO_DE_CORTE, estiloDe(c, b, { size: "normal", bold: false }));
        return;
      }
      if (b.text && b.text.trim()) parrafo(c, b, b.text);
      return;
    case "text":
      if (b.text && b.text.trim()) parrafo(c, b, b.text);
      return;
    case "separator": {
      const estilo = opcionDeBloque<string>(b, "style", c.kind);
      if (estilo === "blank") c.papel.vacia();
      else regla(c, estilo === "double" ? "=" : estilo === "dots" ? "." : "-");
      return;
    }
    case "cash_box": {
      const caja = dato(d.cashBoxName);
      if (caja !== null) parrafo(c, b, conEtiqueta(b.label, caja));
      return;
    }
    case "opening":
    case "closing": {
      const abre = b.type === "opening";
      if (!abre && d.esCorte) {
        // Un corte no tiene hora de cierre ni quien cierre: lo que lleva es la
        // hora en que se saco el papel. Se ignora la etiqueta guardada
        // («Cierra») porque seguiria diciendo que la caja se cerro.
        const pc = partesDeFecha(c.opciones.printedAt ?? new Date());
        if (pc) c.papel.linea(txt(c, `Corte ${fechaCorta(pc)} ${horaDe(pc)}`), est);
        return;
      }
      const p = partesDeFecha(abre ? d.openedAt : d.closedAt);
      const quien = dato(abre ? d.openedByName : d.closedByName);
      if (!p && quien === null) return;
      const etiqueta = b.label === undefined ? (PALABRAS[b.type] ?? "") : b.label.trim();
      const cuando = p ? `${fechaCorta(p)} ${horaDe(p)}` : "-";
      const izq = txt(c, etiqueta ? `${etiqueta} ${cuando}` : cuando);
      c.papel.linea(fila(izq, txt(c, quien ?? ""), ef, "der"), est);
      return;
    }
    case "sales_by_method": {
      const metodos = Array.isArray(d.salesByMethod) ? d.salesByMethod.filter(Boolean) : [];
      if (metodos.length === 0) return;
      titulo(b.label === undefined ? "VENTAS POR METODO" : b.label);
      for (const m of metodos) {
        c.papel.linea(fila(txt(c, m.label), dinero(c, m.total), ef), est);
      }
      if (opcionDeBloque<boolean>(b, "showTotal", c.kind)) {
        const total =
          d.totalSales !== undefined && d.totalSales !== null
            ? num(d.totalSales)
            : metodos.reduce((s, m) => s + num(m.total), 0);
        regla(c, "-");
        c.papel.linea(fila(txt(c, "Total vendido"), dinero(c, total), ef), { ...est, bold: true });
      }
      return;
    }
    case "movements": {
      if (!Array.isArray(d.movements) || d.movements.length === 0) return;
      const verEgresos = opcionDeBloque<boolean>(b, "showExpenses", c.kind);
      const verIngresos = opcionDeBloque<boolean>(b, "showIncome", c.kind);
      const verHora = opcionDeBloque<boolean>(b, "showTime", c.kind);
      const porCategoria = opcionDeBloque<string>(b, "group", c.kind) === "category";
      let yaHayGrupo = false;

      const grupo = (tipo: CashCloseMovement["type"], rotulo: string, conTotal: boolean) => {
        const lista = d.movements!.filter((m) => m && m.type === tipo);
        if (lista.length === 0) return;
        // Sin aire, «INGRESOS» se lee como un renglón más de los egresos.
        if (yaHayGrupo) c.papel.vacia();
        yaHayGrupo = true;
        titulo(`${rotulo} (${lista.length})`);

        if (porCategoria) {
          const sumas = new Map<string, number>();
          for (const m of lista) {
            const k = dato(m.category) ?? "Sin categoría";
            sumas.set(k, (sumas.get(k) ?? 0) + Math.abs(num(m.amount)));
          }
          for (const [k, v] of sumas) {
            c.papel.linea(fila(txt(c, k), dinero(c, v), ef), est);
          }
        } else {
          for (const m of lista) {
            const p = verHora ? partesDeFecha(m.at) : null;
            const izq = `${p ? `${horaDe(p)} ` : ""}${txt(c, m.description || m.category || "Sin detalle")}`;
            c.papel.linea(fila(izq, dinero(c, Math.abs(num(m.amount))), ef), est);
          }
        }
        if (conTotal) {
          const suma = lista.reduce((s, m) => s + Math.abs(num(m.amount)), 0);
          regla(c, "-");
          c.papel.linea(fila(txt(c, "Total egresos"), dinero(c, suma), ef), { ...est, bold: true });
        }
      };
      if (verEgresos) grupo("EXPENSE", "EGRESOS", true);
      if (verIngresos) grupo("INCOME", "INGRESOS", false);
      return;
    }
    case "cash_count": {
      const cu = cuentaDelCajon(d);
      const signos = opcionDeBloque<boolean>(b, "showSigns", c.kind);
      titulo(b.label === undefined ? "EFECTIVO EN EL CAJON" : b.label);

      const suma = (etiqueta: string, valor: number, signo: "+" | "-") => {
        // Con signos la cuenta se lee línea a línea; sin ellos, el egreso lleva
        // su propio menos para que no parezca otra suma.
        const sola = signo === "-" && !signos ? -Math.abs(valor) : Math.abs(valor);
        const izq = signos ? `${signo} ${etiqueta}` : etiqueta;
        c.papel.linea(fila(txt(c, izq), dinero(c, sola), ef), est);
      };
      c.papel.linea(fila(txt(c, "Caja inicial"), dinero(c, cu.inicial), ef), est);
      if (cu.ventas !== null) suma("Ventas en efectivo", cu.ventas, "+");
      suma("Ingresos", cu.ingresos, "+");
      suma("Egresos", cu.egresos, "-");
      if (cu.ajuste !== 0) {
        // Si la cuenta de arriba no llega a lo que la API dice que debe haber
        // (el cierre guarda un movimiento de ajuste, por ejemplo), la fila
        // cubre la diferencia: lo impreso tiene que sumar siempre.
        if (signos) suma("Ajustes", cu.ajuste, cu.ajuste > 0 ? "+" : "-");
        else c.papel.linea(fila(txt(c, "Ajustes"), dinero(c, cu.ajuste), ef), est);
      }
      regla(c, "-");
      // En un corte la caja sigue abierta: «Debe haber» a secas se leeria como
      // el cuadre final, y lo que dice es lo que hay en este momento.
      const debeHaber = d.esCorte ? "Debe haber ahora" : "Debe haber";
      c.papel.linea(fila(txt(c, debeHaber), dinero(c, cu.debeHaber), ef), { ...est, bold: true });
      // Un corte no cuenta el cajon: aunque llegue un `countedAmount`, no se imprime.
      if (!d.esCorte && d.countedAmount !== undefined && d.countedAmount !== null) {
        c.papel.linea(fila(txt(c, "Contado"), dinero(c, d.countedAmount), ef), est);
      }
      return;
    }
    case "result": {
      // Sin arqueo no hay resultado, y un corte no lo tiene aunque traiga
      // un monto contado suelto: un «CUADRA» en un corte se archivaria como cierre.
      if (d.esCorte) return;
      if (d.countedAmount === undefined || d.countedAmount === null) return;
      const cu = cuentaDelCajon(d);
      const dif = num(d.countedAmount) - cu.debeHaber;
      const estilo = opcionDeBloque<string>(b, "style", c.kind);
      let texto: string;
      if (estilo === "difference") texto = `DIFERENCIA ${dinero(c, dif)}`;
      else if (Math.abs(dif) < 0.005) texto = "CUADRA";
      else if (dif < 0) texto = `FALTA ${dinero(c, -dif)}`;
      else texto = `SOBRA ${dinero(c, dif)}`;
      const ajustado = cuerpoQueEntra(c, est, txt(c, texto));
      parrafo(c, b, texto, ajustado);
      return;
    }
    case "orders_list": {
      const ordenes = Array.isArray(d.orders) ? d.orders.filter(Boolean) : [];
      if (ordenes.length === 0) return;
      if (opcionDeBloque<string>(b, "mode", c.kind) === "list") {
        titulo(`COMANDAS (${ordenes.length})`);
        for (const o of ordenes) {
          const etiqueta = o.table ? `${o.code} ${o.table}` : String(o.code ?? "");
          c.papel.linea(fila(txt(c, etiqueta), dinero(c, o.total), ef), est);
        }
      } else {
        parrafo(c, b, `${ordenes.length} ${ordenes.length === 1 ? "comanda" : "comandas"}`);
      }
      return;
    }
    case "printed_at": {
      const p = partesDeFecha(c.opciones.printedAt ?? new Date());
      if (!p) return;
      parrafo(c, b, conEtiqueta(b.label, `${fechaCorta(p)} ${horaDe(p)}`));
      return;
    }
    case "signature": {
      const etiqueta = b.label === undefined ? "Firma" : b.label.trim();
      c.papel.vacia(2);
      const raya = "_".repeat(Math.max(8, Math.min(24, ef - etiqueta.length - 2)));
      parrafo(c, b, etiqueta ? `${etiqueta}: ${raya}` : raya);
      return;
    }
    default:
      return;
  }
}

// ─── Entrada ────────────────────────────────────────────────────────────────

/** Cuántas líneas en blanco antes del corte: lo mismo que los encoders clásicos. */
const AVANCE: Record<DocumentKind, number> = {
  comanda: 5,
  precuenta: 4,
  comprobante: 4,
  cierre: 4,
};

const esTituloDeCorte = (datos: DatosDocumento, b: TemplateBlock) =>
  datos.kind === "cierre" && datos.cierre?.esCorte === true && b.type === "title";

function construir(
  datos: DatosDocumento,
  branding: TicketBranding,
  opciones: OpcionesDeDocumento,
): { bytes: Uint8Array; ids: (string | null)[]; omitidos: string[] } {
  const paperWidth = opciones.paperWidth ?? "80mm";
  const papel = new Papel(columnasDe(paperWidth));
  const kind = datos.kind;
  const plantilla = opciones.plantilla;

  const c: Ctx = {
    papel,
    kind,
    branding: branding ?? {},
    opciones,
    plantilla,
    simbolo:
      (datos.kind === "cierre" ? datos.cierre?.currency : undefined) || opciones.currency || "S/",
    datos,
  };

  const omitidos: string[] = [];
  const bloques = Array.isArray(plantilla?.blocks) ? plantilla.blocks : [];
  /**
   * Dos reglas seguidas se funden en una. Pasa sin que nadie lo diseñe: los
   * datos que van entre dos separadores pueden no existir en ESTE pedido —sin
   * cliente, sin notas, sin egresos—, y entonces el ticket sacaba dos rayas
   * pegadas que parecían un error de impresión.
   */
  let acabaDeSalirUnaRegla = false;
  // Una plantilla sin bloque `title` (borrado en el editor) tampoco puede dejar
  // el corte sin su nombre: se pone uno al principio, con el estilo de fabrica.
  const sinTituloDeCorte =
    datos.kind === "cierre" &&
    datos.cierre?.esCorte === true &&
    !bloques.some((b) => b && b.type === "title");
  const lista: TemplateBlock[] = sinTituloDeCorte
    ? [{ id: "title", type: "title", visible: true, bold: true, align: "center" }, ...bloques]
    : bloques;
  for (const b of lista) {
    if (!b || typeof b !== "object") continue;
    const def = DEFINICIONES[b.type];
    if (!def) continue;
    // El aviso legal se imprime aunque la plantilla diga que no; el titulo de
    // un corte, igual (ver `TITULO_DE_CORTE`).
    if (b.visible === false && !def.obligatorio && !esTituloDeCorte(datos, b)) continue;

    const esRegla =
      b.type === "separator" && opcionDeBloque<string>(b, "style", kind) !== "blank";
    if (esRegla && acabaDeSalirUnaRegla) continue;
    const lineasAntes = papel.ids.length;

    papel.actual = b.id;
    try {
      if (datos.kind === "cierre") {
        bloqueDeCierre(c, b, datos.cierre);
      } else {
        bloqueDePedido(c, b, datos.pedido, datos.documento);
      }
    } catch {
      // Un bloque que falla se salta; el ticket sale igual.
      omitidos.push(b.id);
    }
    if (papel.ids.length > lineasAntes) acabaDeSalirUnaRegla = esRegla;
  }

  papel.actual = null;
  papel.vacia(AVANCE[kind] ?? 4);
  papel.cortar();
  return { bytes: papel.bytes(), ids: papel.ids, omitidos };
}

export function encodeDocumento(
  datos: DatosDocumento,
  branding: TicketBranding,
  opciones: OpcionesDeDocumento,
): DocumentoCodificado {
  let resultado: { bytes: Uint8Array; ids: (string | null)[]; omitidos: string[] };
  try {
    resultado = construir(datos, branding, opciones);
  } catch {
    // Ni siquiera el armado general: se entrega un papel en blanco con corte,
    // antes que dejar al mostrador sin ticket ni explicación.
    const papel = new Papel(columnasDe(opciones?.paperWidth ?? "80mm"));
    papel.vacia(3);
    papel.cortar();
    resultado = { bytes: papel.bytes(), ids: papel.ids, omitidos: ["*"] };
  }

  // La cuenta de líneas es la del parser, que es lo que dibuja el editor. Si
  // alguna vez se separan, es mejor un `null` de más que una selección
  // corrida una fila.
  const { bytes, ids, omitidos } = resultado;
  const total = parseEscPos(bytes).length;
  const bloquePorLinea = ids.slice(0, total);
  while (bloquePorLinea.length < total) bloquePorLinea.push(null);
  return { bytes, bloquePorLinea, omitidos };
}
