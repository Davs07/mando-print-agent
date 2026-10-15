/**
 * Leer, validar y guardar plantillas.
 *
 * Todo lo de aquí cumple la misma regla que `leerFormato`: NUNCA lanza. La
 * plantilla sale de un JSON guardado en la base, y un negocio con ese JSON roto
 * tiene que seguir imprimiendo — un ticket que no sale es peor que uno con el
 * diseño de fábrica.
 */

import type { PrintFormatConfig } from "../format";
import {
  ALINEACIONES,
  BLOQUES_DE,
  DEFINICIONES,
  ESQUELETOS,
  TAMANOS,
  esObligatorio,
  opcionesDe,
} from "./catalogo";
import type {
  BlockAlign,
  BlockOptionValue,
  BlockSize,
  BlockType,
  DocumentKind,
  TemplateBlock,
  TicketTemplate,
} from "./tipos";

/** Tope de bloques: una plantilla de 500 separadores es un ticket de 2 metros. */
const MAX_BLOQUES = 60;
const MAX_ETIQUETA = 40;
const MAX_TEXTO = 300;

/** Identificador para un bloque que el usuario acaba de agregar. */
export function nuevoIdDeBloque(type: BlockType): string {
  return `${type}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * La plantilla de fábrica de un documento.
 *
 * Los ids son deterministas —`title`, `separator-1`— y no aleatorios: los tests
 * comparan plantillas, y React necesita la misma clave en cada render.
 */
export function plantillaPorDefecto(kind: DocumentKind): TicketTemplate {
  const cuenta = new Map<BlockType, number>();
  const blocks = ESQUELETOS[kind].map((semilla): TemplateBlock => {
    const { type, ...resto } = semilla;
    const n = (cuenta.get(type) ?? 0) + 1;
    cuenta.set(type, n);
    return {
      id: DEFINICIONES[type].repetible ? `${type}-${n}` : type,
      type,
      visible: true,
      ...resto,
    };
  });
  // Las dos banderas explícitas: así la de fábrica es idéntica a cómo la devuelve
  // `leerPlantilla` tras guardarla, y comparar «¿la cambió el usuario?» no falla.
  return { version: 2, blocks, uppercase: kind === "comanda", extraBold: false };
}

/** El valor de una opción del bloque, o el de fábrica si no la tiene guardada. */
export function opcionDeBloque<T extends BlockOptionValue>(
  block: Pick<TemplateBlock, "type" | "options">,
  key: string,
  kind: DocumentKind,
): T {
  const def = opcionesDe(block.type, kind).find((o) => o.key === key);
  const guardado = block.options?.[key];
  if (def && guardado !== undefined && typeof guardado === typeof def.porDefecto) {
    return guardado as T;
  }
  return (def?.porDefecto ?? guardado) as T;
}

const cadena = (v: unknown, max: number): string | undefined =>
  typeof v === "string" ? v.slice(0, max) : undefined;

/** Un bloque guardado, reducido a lo que el catálogo reconoce. */
function sanearBloque(
  raw: unknown,
  kind: DocumentKind,
  idsVistos: Set<string>,
): TemplateBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;

  const type = b.type as BlockType;
  if (typeof type !== "string" || !BLOQUES_DE[kind].includes(type)) return null;
  const def = DEFINICIONES[type];

  let id = typeof b.id === "string" && b.id ? b.id.slice(0, 60) : nuevoIdDeBloque(type);
  // Dos bloques con el mismo id rompen el arrastre y la selección del editor.
  while (idsVistos.has(id)) id = nuevoIdDeBloque(type);
  idsVistos.add(id);

  const bloque: TemplateBlock = {
    id,
    type,
    // Lo obligatorio (el aviso legal, lo que SUNAT exige en una boleta) se
    // imprime aunque el JSON diga otra cosa.
    visible: esObligatorio(type, kind) ? true : b.visible !== false,
  };

  if (typeof b.size === "string" && b.size in TAMANOS) bloque.size = b.size as BlockSize;
  if (typeof b.bold === "boolean") bloque.bold = b.bold;
  if (typeof b.align === "string" && b.align in ALINEACIONES) {
    bloque.align = b.align as BlockAlign;
  }
  const label = cadena(b.label, MAX_ETIQUETA);
  if (label !== undefined) bloque.label = label;
  const text = cadena(b.text, MAX_TEXTO);
  if (text !== undefined) bloque.text = text;

  if (b.options && typeof b.options === "object") {
    const guardadas = b.options as Record<string, unknown>;
    const options: Record<string, BlockOptionValue> = {};
    for (const def of opcionesDe(type, kind)) {
      const v = guardadas[def.key];
      if (def.tipo === "boolean" && typeof v === "boolean") options[def.key] = v;
      if (
        def.tipo === "select" &&
        typeof v === "string" &&
        def.opciones?.some((o) => o.value === v)
      ) {
        options[def.key] = v;
      }
    }
    if (Object.keys(options).length > 0) bloque.options = options;
  }

  return bloque;
}

/**
 * Lee una plantilla guardada. Devuelve `null` si aquello no es una plantilla,
 * y entonces quien llama imprime con el formato clásico.
 *
 * Tres reglas, y la tercera es la que evita el fallo silencioso:
 *
 * 1. Se descarta lo que el catálogo no reconoce: un tipo viejo, una opción que
 *    ya no existe, un tamaño inventado. Un dato raro en la base no tumba la
 *    impresión.
 *
 * 2. Un bloque no repetible aparece una sola vez; gana el primero.
 *
 * 3. Los bloques que la plantilla guardada no conoce se INSERTAN donde les toca
 *    según el esqueleto, con su visibilidad de fábrica. Sin esto, el día que
 *    agreguemos un dato nuevo, los negocios que alguna vez guardaron un diseño
 *    no podrían ni encontrarlo en el editor. Se insertan junto a su vecino del
 *    esqueleto y no al final, porque un «Subtotal» después del agradecimiento
 *    no es un ticket.
 */
export function leerPlantilla(raw: unknown, kind: DocumentKind): TicketTemplate | null {
  let dato: unknown = raw;
  if (typeof dato === "string") {
    try {
      dato = JSON.parse(dato);
    } catch {
      return null;
    }
  }
  if (!dato || typeof dato !== "object" || Array.isArray(dato)) return null;

  const t = dato as Record<string, unknown>;
  if (t.version !== 2 || !Array.isArray(t.blocks)) return null;

  const idsVistos = new Set<string>();
  const unicos = new Set<BlockType>();
  const blocks: TemplateBlock[] = [];

  for (const crudo of t.blocks.slice(0, MAX_BLOQUES)) {
    const bloque = sanearBloque(crudo, kind, idsVistos);
    if (!bloque) continue;
    if (!DEFINICIONES[bloque.type].repetible) {
      if (unicos.has(bloque.type)) continue;
      unicos.add(bloque.type);
    }
    blocks.push(bloque);
  }

  // Regla 3: lo que falta entra junto a su vecino anterior del esqueleto.
  const fabrica = plantillaPorDefecto(kind).blocks;
  fabrica.forEach((semilla, i) => {
    if (DEFINICIONES[semilla.type].repetible || unicos.has(semilla.type)) return;

    let posicion = 0;
    for (let j = i - 1; j >= 0; j--) {
      const vecino = fabrica[j]!;
      if (DEFINICIONES[vecino.type].repetible) continue;
      const donde = blocks.findIndex((b) => b.type === vecino.type);
      if (donde >= 0) {
        posicion = donde + 1;
        break;
      }
    }
    idsVistos.add(semilla.id);
    // Un obligatorio que faltaba vuelve visible, sea cual sea su visibilidad de
    // fábrica: no se puede borrar un bloque para dejar de imprimirlo.
    blocks.splice(posicion, 0, {
      ...semilla,
      visible: esObligatorio(semilla.type, kind) ? true : semilla.visible,
    });
    unicos.add(semilla.type);
  });

  return {
    version: 2,
    blocks,
    uppercase: t.uppercase === true,
    extraBold: t.extraBold === true,
  };
}

/**
 * En qué formato vive la plantilla de cada documento.
 *
 * No hay columna nueva en la base, y es a propósito: las plantillas viajan
 * DENTRO de los dos JSON de «Formato avanzado» que ya existen. La API no los
 * interpreta —solo los guarda y se los pasa al agente de impresión—, así que el
 * editor llega a todos los caminos de impresión sin migración, sin tocar DTOs y
 * sin que web y la API tengan que desplegar a la vez.
 */
export const FORMATO_DE: Record<DocumentKind, "kitchen" | "receipt"> = {
  comanda: "kitchen",
  precuenta: "receipt",
  comprobante: "receipt",
  cierre: "receipt",
  electronico: "receipt",
};

function comoObjeto(
  formato: string | PrintFormatConfig | null | undefined,
): PrintFormatConfig | null {
  if (!formato) return null;
  if (typeof formato === "object") return formato;
  try {
    const parsed = JSON.parse(formato) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as PrintFormatConfig)
      : null;
  } catch {
    return null;
  }
}

/**
 * La plantilla de un documento guardada en su formato, o `null` si el negocio
 * nunca diseñó ese documento. Acepta el objeto ya parseado (el panel) o el JSON
 * crudo (el agente, que lo recibe por websocket).
 */
export function plantillaDeFormato(
  formato: string | PrintFormatConfig | null | undefined,
  kind: DocumentKind,
): TicketTemplate | null {
  return leerPlantilla(comoObjeto(formato)?.templates?.[kind], kind);
}

/**
 * El formato con la plantilla de un documento puesta, o quitada con `null`.
 * Quitarla devuelve ese documento al formato clásico.
 */
export function formatoConPlantilla(
  formato: PrintFormatConfig | null | undefined,
  kind: DocumentKind,
  plantilla: TicketTemplate | null,
): PrintFormatConfig {
  const base = { ...(formato ?? {}) };
  const templates = { ...(base.templates ?? {}) };
  if (plantilla) templates[kind] = plantilla;
  else delete templates[kind];

  if (Object.keys(templates).length > 0) base.templates = templates;
  else delete base.templates;
  return base;
}
