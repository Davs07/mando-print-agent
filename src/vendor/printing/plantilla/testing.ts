/**
 * Ayudas de los tests de plantillas. No se exporta del paquete.
 */

import { parseEscPos, type PreviewLine } from "../preview/parse";
import { BRANDING_DE_MUESTRA } from "../preview/sample";
import type { PaperWidth, TicketBranding } from "../types";
import { columnasDe } from "../types";
import { encodeDocumento } from "./motor";
import type { BlockType, DatosDocumento, TemplateBlock, TicketTemplate } from "./tipos";

type Bloque = Partial<Omit<TemplateBlock, "type">> & { type: BlockType };

/** Una plantilla con solo estos bloques, con ids `tipo` o `tipo-n`. */
export function plantilla(
  bloques: Bloque[],
  extra: Partial<Omit<TicketTemplate, "blocks" | "version">> = {},
): TicketTemplate {
  const cuenta = new Map<string, number>();
  return {
    version: 2,
    blocks: bloques.map((b) => {
      const n = (cuenta.get(b.type) ?? 0) + 1;
      cuenta.set(b.type, n);
      return { id: n === 1 ? b.type : `${b.type}-${n}`, visible: true, ...b };
    }),
    ...extra,
  };
}

export interface Resultado {
  bytes: Uint8Array;
  lineas: PreviewLine[];
  ids: (string | null)[];
  omitidos: string[];
  /** Cada línea tal como se vería en papel: sangría + texto. */
  texto: string[];
  /** Solo las que traen algo escrito, sin sangría. */
  escritas: string[];
}

export function codificar(
  datos: DatosDocumento,
  plantillaDe: TicketTemplate,
  opts: { paperWidth?: PaperWidth; branding?: TicketBranding; currency?: string; storeName?: string } = {},
): Resultado {
  const r = encodeDocumento(datos, opts.branding ?? BRANDING_DE_MUESTRA, {
    paperWidth: opts.paperWidth,
    plantilla: plantillaDe,
    currency: opts.currency,
    storeName: opts.storeName,
    printedAt: "2026-10-08T04:12:00.000Z",
  });
  const lineas = parseEscPos(r.bytes);
  const texto = lineas.map((l) => " ".repeat(l.sangria) + l.texto);
  return {
    bytes: r.bytes,
    lineas,
    ids: r.bloquePorLinea,
    omitidos: r.omitidos,
    texto,
    escritas: lineas.map((l) => l.texto.trim()).filter(Boolean),
  };
}

/** Columnas que entran en una línea de esa fuente. */
export function columnasDeLinea(paperWidth: PaperWidth, fuente: "A" | "B" | undefined): number {
  const c = columnasDe(paperWidth);
  return fuente === "B" ? Math.floor((c * 4) / 3) : c;
}

/** Columnas que OCUPA una línea: relleno a cuerpo normal + texto al ancho de su cuerpo. */
export const ocupa = (l: PreviewLine) => l.sangria + l.texto.length * l.escala;
