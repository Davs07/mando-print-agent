import type { PaperWidth } from "../types";
import { columnasDe } from "../types";
import type { PreviewLine } from "./parse";
import { modulosDeQr } from "../escpos/qr";

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
 * - Ancho y alto son independientes (`GS ! n`): «Alta» es el doble de alta y del
 *   MISMO ancho, «Ancha» al revés. Se dibuja con el cuerpo del ALTO y se
 *   estira o encoge en horizontal con `scaleX`; el resto de la línea no se
 *   entera porque una transformación no mueve el diseño.
 * - La fuente B es más estrecha: 9 de los 12 puntos de la A. Entran 4/3 de
 *   columnas, y se dibuja a 3/4 del cuerpo.
 *
 * - El QR se dibuja con el tamaño que tendría en papel: `módulos × módulo ÷ 12`
 *   columnas (una columna A son 12 puntos). Y es la única línea que se alinea
 *   con CSS, porque es la única cuya alineación viaja como comando (`ESC a`)
 *   y no como relleno.
 *
 * CONTRATO con el editor: cada `PreviewLine` es EXACTAMENTE un elemento hijo
 * directo del resultado, en orden, y lleva `data-linea="<índice>"`. Es lo que
 * deja seleccionar un bloque tocando su línea (ver `bloquePorLinea`). La línea
 * de un QR cumple lo mismo: un solo `div` con su `data-linea`.
 */

export interface RenderHtmlOptions {
  paperWidth?: PaperWidth;
  /** Cuerpo base en píxeles. El resto se multiplica por la escala de cada línea. */
  fontSizePx?: number;
  /**
   * Cómo dibujar un QR: recibe su CONTENIDO y devuelve HTML (un `<svg>`, un
   * `<img>`…). El paquete no trae librería de QR a propósito —no tiene
   * dependencias salvo el encoder, y el agente de impresión lo copia—, así que
   * el panel pasa la suya. Sin esta función se dibuja un recuadro con «QR» del
   * tamaño que tendrá en papel.
   *
   * El HTML que devuelva va dentro de una caja de ese tamaño, y un `svg`, `img`
   * o `canvas` hijo se estira a llenarla. Debe venir ya escapado: se inserta tal
   * cual.
   */
  dibujarQr?: (contenido: string) => string;
}

const escapar = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** La línea de un QR: una caja del tamaño del papel, alineada como el comando. */
function renderQr(l: PreviewLine, i: number, options: RenderHtmlOptions): string {
  // Una columna de la fuente A son 12 puntos; el lado en puntos es módulos × módulo.
  const lado = Math.round(((modulosDeQr(l.qr ?? "") * (l.qrModulo ?? 6)) / 12) * 100) / 100;
  const alinea =
    l.qrAlineacion === "center" ? "center" : l.qrAlineacion === "right" ? "right" : "left";
  let dentro: string;
  try {
    dentro = options.dibujarQr ? options.dibujarQr(l.qr ?? "") : "";
  } catch {
    // Un dibujante de QR roto no puede dejar la vista previa sin ticket.
    dentro = "";
  }
  const interior = dentro || '<span class="mp-qr-vacio">QR</span>';
  return `<div class="mp-ln mp-qr" data-linea="${i}" style="text-align:${alinea}"><span class="mp-qr-caja" style="width:${lado}ch;height:${lado}ch">${interior}</span></div>`;
}

/** El cuerpo del ticket: solo las líneas, sin envoltorio ni estilos de página. */
export function renderTicketLinesHtml(
  lineas: PreviewLine[],
  options: RenderHtmlOptions = {},
): string {
  const base = options.fontSizePx ?? 11;

  return lineas
    .map((l, i) => {
      if (l.qr !== undefined) return renderQr(l, i, options);

      if (l.texto.trim().length === 0) {
        return `<div class="mp-sp" data-linea="${i}"></div>`;
      }

      // Una columna de fuente B mide 3/4 de una de A.
      const ff = l.fuente === "B" ? 0.75 : 1;
      const cuerpo = Math.round(base * ff * 1000) / 1000;
      // Sin `alto` (lineas armadas a mano, o de antes) el cuerpo es cuadrado.
      const alto = l.alto ?? l.escala;
      const fs = Math.round(cuerpo * alto * 1000) / 1000;
      const estira = l.escala / alto;

      const margen =
        l.sangria > 0
          ? `<span class="mp-margen" style="width:${l.sangria}ch${
              ff !== 1 ? `;font-size:${cuerpo}px` : ""
            }"></span>`
          : "";

      const estilos = [
        fs !== base ? `font-size:${fs}px` : "",
        l.escala > 1 || l.negrita ? "font-weight:700" : "",
        Math.abs(estira - 1) > 1e-6
          ? `display:inline-block;transform-origin:0 0;transform:scaleX(${
              Math.round(estira * 1000) / 1000
            })`
          : "",
      ]
        .filter(Boolean)
        .join(";");

      const interlineado = l.escala > 1 || alto > 1 ? ' style="line-height:1.2"' : "";
      return `<div class="mp-ln" data-linea="${i}"${interlineado}>${margen}<span style="${estilos}">${escapar(l.texto)}</span></div>`;
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
.mp-qr { line-height: 0; padding: .3em 0; }
.mp-qr-caja { display: inline-block; vertical-align: top; box-sizing: border-box; }
.mp-qr-caja > svg, .mp-qr-caja > img, .mp-qr-caja > canvas {
  display: block; width: 100%; height: 100%; image-rendering: pixelated;
}
.mp-qr-vacio {
  display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;
  box-sizing: border-box; border: 2px solid #000; font-weight: 700; line-height: 1;
}
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
