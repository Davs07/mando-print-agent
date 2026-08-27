import type { PaperWidth } from "../types";
import { columnasDe } from "../types";
import type { PreviewLine } from "./parse";

/**
 * Dibuja en HTML las líneas que salieron del encoder.
 *
 * POR QUÉ EXISTE: «que se imprima igual da igual quién imprima» solo se cumple
 * si el HTML sale de los MISMOS bytes que el papel. Antes el navegador tenía su
 * propia plantilla —otra cabecera, otros separadores, otro orden— y el negocio
 * veía un diseño en pantalla, otro por Bluetooth y un tercero al caer en el
 * plan B del navegador.
 *
 * Este renderizador lo usan los tres sitios que dibujan un ticket en pantalla:
 * la vista previa del panel, la impresión por navegador y el PDF. Ninguno
 * maqueta nada: todos reciben `PreviewLine[]` y los pintan.
 *
 * Reglas de dibujo, medidas contra el encoder y no supuestas:
 *
 * - Monoespaciada y `white-space: pre`. El encoder alinea RELLENANDO con
 *   espacios, así que el relleno ya trae la alineación; un `text-align` encima
 *   la descuadraría.
 * - El ancho en `ch`: una columna de pantalla es una columna de papel.
 * - La sangría se dibuja a cuerpo NORMAL aunque el texto vaya agrandado, porque
 *   el encoder la emite antes del comando de tamaño.
 */

export interface RenderHtmlOptions {
  paperWidth?: PaperWidth;
  /** Cuerpo base en píxeles. El resto se multiplica por la escala de cada línea. */
  fontSizePx?: number;
}

const escapar = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** El cuerpo del ticket: solo las líneas, sin envoltorio ni estilos de página. */
export function renderTicketLinesHtml(
  lineas: PreviewLine[],
  options: RenderHtmlOptions = {},
): string {
  const base = options.fontSizePx ?? 11;

  return lineas
    .map((l) => {
      if (l.texto.trim().length === 0) {
        return '<div class="mp-sp"></div>';
      }

      const margen =
        l.sangria > 0
          ? `<span class="mp-margen" style="width:${l.sangria}ch"></span>`
          : "";

      const estilos = [
        l.escala > 1 ? `font-size:${base * l.escala}px` : "",
        l.escala > 1 || l.negrita ? "font-weight:700" : "",
      ]
        .filter(Boolean)
        .join(";");

      const alto = l.escala > 1 ? ' style="line-height:1.2"' : "";
      return `<div class="mp-ln"${alto}>${margen}<span style="${estilos}">${escapar(l.texto)}</span></div>`;
    })
    .join("");
}

/** Los estilos que necesita el cuerpo. Se comparten entre pantalla y papel. */
export function ticketCss(options: RenderHtmlOptions = {}): string {
  const base = options.fontSizePx ?? 11;
  const columnas = columnasDe(options.paperWidth ?? "80mm");

  return `
.mp-ticket {
  width: ${columnas}ch;
  font-family: "Consolas", ui-monospace, "SF Mono", "Courier New", monospace;
  font-size: ${base}px;
  line-height: 1.45;
  white-space: pre;
  color: #000;
}
.mp-margen { display: inline-block; }
.mp-sp { height: .62em; }
`.trim();
}

/**
 * Un documento HTML completo, listo para mandar a imprimir.
 *
 * `@page { margin: 0 }` y el ancho exacto del papel: sin eso el navegador mete
 * sus márgenes de A4 y el ticket sale con la mitad del papel en blanco.
 */
export function renderTicketDocument(
  lineas: PreviewLine[],
  options: RenderHtmlOptions & { title?: string } = {},
): string {
  const columnas = columnasDe(options.paperWidth ?? "80mm");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapar(options.title ?? "Ticket")}</title>
<style>
@page { size: auto; margin: 0; }
html, body { margin: 0; padding: 0; background: #fff; }
body { display: flex; justify-content: center; }
${ticketCss(options)}
.mp-ticket { padding: 4mm 2mm 10mm; max-width: ${columnas}ch; }
</style>
</head>
<body><div class="mp-ticket">${renderTicketLinesHtml(lineas, options)}</div></body>
</html>`;
}
