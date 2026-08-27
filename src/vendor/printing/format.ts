/**
 * «Formato avanzado»: lo que el negocio configura sobre CÓMO se ve el ticket.
 *
 * Este archivo es la única fuente de verdad. Antes vivía por triplicado —en el
 * dominio de `apps/web`, en el encoder del panel y en el del agente— y cada
 * copia interpretaba las preferencias a su manera: el orden de secciones no lo
 * leía nadie, y el agente ignoraba el formato entero.
 */

export type PrintSectionKey =
  | "logo"
  | "header"
  | "order_info"
  | "meta"
  | "items"
  | "notes"
  | "total"
  | "footer";

export interface PrintFormatConfig {
  boldBusinessName?: boolean;
  boldTitle?: boolean;
  boldOrderNumber?: boolean;
  boldItemNames?: boolean;
  boldTotal?: boolean;
  boldOrderNotes?: boolean;
  boldCustomText?: boolean;
  uppercase?: boolean;
  /** Sube todo el texto a negrita, para impresoras que salen muy claras. */
  extraBold?: boolean;
  sectionOrder?: PrintSectionKey[];
}

export const DEFAULT_KITCHEN_FORMAT: PrintFormatConfig = {
  boldBusinessName: true,
  boldTitle: true,
  boldOrderNumber: true,
  boldItemNames: true,
  boldTotal: false,
  boldOrderNotes: false,
  boldCustomText: false,
  uppercase: true,
  /**
   * `notes` va ANTES que `items` a propósito: la nota del pedido («cliente con
   * prisa», «alergia al maní») es contexto para todo lo que viene después.
   * Leerla al final, con los platos ya emplatados, no sirve.
   */
  sectionOrder: ["logo", "header", "order_info", "meta", "notes", "items", "footer"],
};

export const DEFAULT_RECEIPT_FORMAT: PrintFormatConfig = {
  boldBusinessName: true,
  boldTitle: true,
  boldOrderNumber: false,
  boldItemNames: false,
  boldTotal: true,
  boldOrderNotes: false,
  boldCustomText: false,
  uppercase: false,
  sectionOrder: ["logo", "header", "order_info", "meta", "items", "notes", "total", "footer"],
};

/**
 * Lee el formato tal como llega: objeto ya parseado (el panel) o JSON crudo (el
 * agente, que lo recibe por websocket).
 *
 * NUNCA lanza. Un negocio con la preferencia corrupta tiene que seguir
 * imprimiendo: un ticket que no sale es peor que uno con el formato de fábrica.
 */
export function leerFormato(
  raw: string | PrintFormatConfig | null | undefined,
  porDefecto: PrintFormatConfig,
): PrintFormatConfig {
  if (!raw) return { ...porDefecto };
  if (typeof raw === "object") return { ...porDefecto, ...raw };

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...porDefecto };
    }
    return { ...porDefecto, ...(parsed as PrintFormatConfig) };
  } catch {
    return { ...porDefecto };
  }
}

/**
 * En qué orden se dibujan las secciones.
 *
 * Dos reglas, y la segunda es la que evita el fallo silencioso:
 *
 * 1. Se descarta lo que no reconocemos y lo duplicado. Una clave vieja en la
 *    base no debe tumbar la impresión.
 *
 * 2. Se añaden al final las secciones que el negocio no tenga guardadas. Sin
 *    esto, el día que agreguemos una sección desaparecería de golpe para todos
 *    los negocios que alguna vez tocaron el panel: su `sectionOrder` no la
 *    menciona, y se quedarían sin ella sin que nadie lo pidiera. Es el tipo de
 *    bug que no da error y se descubre en el mostrador.
 */
export function seccionesOrdenadas(
  fmt: Pick<PrintFormatConfig, "sectionOrder">,
  porDefecto: readonly PrintSectionKey[],
): PrintSectionKey[] {
  const conocidas = new Set<PrintSectionKey>(porDefecto);
  const guardadas = Array.isArray(fmt.sectionOrder) ? fmt.sectionOrder : [];

  const orden: PrintSectionKey[] = [];
  const vistas = new Set<PrintSectionKey>();

  for (const clave of guardadas) {
    if (!conocidas.has(clave) || vistas.has(clave)) continue;
    orden.push(clave);
    vistas.add(clave);
  }
  for (const clave of porDefecto) {
    if (!vistas.has(clave)) orden.push(clave);
  }
  return orden;
}
