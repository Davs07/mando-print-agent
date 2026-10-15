/**
 * El tamaño del QR de la boleta, calculado una sola vez para el encoder y la
 * vista previa.
 *
 * SUNAT pide que el QR de la representación impresa mida AL MENOS unos 2 cm de
 * lado: por debajo, los lectores de móvil fallan con el papel térmico, que
 * emborrona. La impresora no entiende de centímetros sino de «tamaño de
 * módulo» (1 a 8 puntos por cuadradito, `GS ( k` función 67), así que el
 * tamaño en papel es `módulos × tamaño de módulo ÷ puntos por mm`:
 *
 * - 203 dpi ≈ 8 puntos por mm (la térmica de 58 y 80 mm más común);
 * - el contenido típico de SUNAT, `RUC|tipo|serie|correlativo|IGV|total|fecha|`
 *   `tipoDoc|numDoc|`, son unos 70–85 bytes: versión 5 con corrección M, o sea
 *   37 × 37 módulos;
 * - módulo 5 → 185 puntos = 23 mm; módulo 6 → 222 puntos = 27,7 mm. Se usa 6
 *   porque deja margen en una impresora de 180 dpi y sigue entrando en 58 mm
 *   (384 puntos útiles).
 *
 * La versión se ESTIMA por la capacidad en modo byte con corrección M; la
 * impresora elige la suya, que con contenido de este tamaño coincide. Si no
 * coincidiera, el error es de una versión (4 módulos, ~3 mm).
 */

import type { PaperWidth } from "../types";

/** Puntos por milímetro de una térmica de 203 dpi. */
export const PUNTOS_POR_MM = 8;
/** Lado mínimo del QR en papel, en milímetros. */
export const QR_MINIMO_MM = 20;
/** Módulo con el que sale por defecto (ver la cuenta de arriba). */
export const MODULO_DE_QR = 6;
/** Puntos imprimibles de cada papel (48 y 72 mm). */
const PUNTOS_UTILES: Record<PaperWidth, number> = { "58mm": 384, "80mm": 576 };

/** Capacidad en bytes (modo byte, corrección M) de las versiones 1 a 20. */
const CAPACIDAD_M = [
  14, 26, 42, 62, 84, 106, 122, 152, 180, 213,
  251, 287, 331, 362, 412, 450, 504, 560, 624, 666,
];

/** Cuántos módulos de lado tiene el QR de este contenido (estimado). */
export function modulosDeQr(contenido: string): number {
  // El contenido se manda en ISO-8859-1: un carácter, un byte.
  const bytes = contenido.length;
  const idx = CAPACIDAD_M.findIndex((c) => c >= bytes);
  const version = idx >= 0 ? idx + 1 : CAPACIDAD_M.length;
  return 17 + 4 * version;
}

/**
 * El tamaño de módulo (1 a 8) para este contenido en este papel: 6 como norma,
 * más si el contenido es tan corto que 6 no llega a 2 cm, y menos solo si no
 * cabe de ancho. Un QR que se sale del papel no se imprime entero.
 */
export function tamanoDeModuloQr(contenido: string, paperWidth: PaperWidth): number {
  const modulos = modulosDeQr(contenido);
  const paraDosCm = Math.ceil((QR_MINIMO_MM * PUNTOS_POR_MM) / modulos);
  const quecabe = Math.floor(PUNTOS_UTILES[paperWidth] / modulos);
  return Math.max(1, Math.min(8, Math.max(MODULO_DE_QR, paraDosCm), quecabe));
}

/** Lado del QR en milímetros, para los tests y la vista previa. */
export function ladoDeQrEnMm(contenido: string, paperWidth: PaperWidth): number {
  return (modulosDeQr(contenido) * tamanoDeModuloQr(contenido, paperWidth)) / PUNTOS_POR_MM;
}
