/**
 * Decodifica un flujo ESC/POS a líneas dibujables.
 *
 * POR QUÉ VIVE AQUÍ, junto al encoder: es su contrario exacto. Una vista previa
 * escrita aparte —maquetando «como se verá»— es el fallo clásico de los
 * editores de tickets: empieza pareciéndose y acaba mintiendo, porque nadie
 * actualiza los dos lados a la vez. Al leer los MISMOS bytes que recibe la
 * impresora, la pantalla no puede discrepar del papel.
 *
 * DOS COSAS QUE SE MIDIERON, no se supusieron:
 *
 * 1. La alineación NO viaja en `ESC a`. Con `columns` configurado, el encoder
 *    centra y alinea RELLENANDO CON ESPACIOS, y nunca emite el comando. Por eso
 *    aquí no hay `centrado` ni `derecha`: el relleno ya está en el texto, y
 *    dibujarlo con `white-space: pre` lo respeta. Añadir además `text-align`
 *    lo descuadraría.
 *
 * 2. El estilo se restablece ANTES del salto de línea: el encoder emite
 *    `ESC E 0` y `GS ! 0` y después el `\n`. Capturar las banderas al ver el
 *    salto devolvía siempre el estilo ya apagado —todo el ticket salía en
 *    cuerpo normal—, así que se capturan al escribir el primer carácter
 *    imprimible de cada línea, que es cuando de verdad se aplican.
 */

export interface PreviewLine {
  /**
   * Columnas de margen que el encoder puso para alinear, SIEMPRE a ancho
   * normal. Se dibujan a cuerpo normal aunque el texto vaya agrandado.
   */
  sangria: number;
  /** El texto, ya sin el margen de alineación. */
  texto: string;
  /**
   * Multiplicador del cuerpo, de 1 a 8. Cada carácter ocupa `escala` columnas,
   * así que una línea a 3× con 16 caracteres llena las 48 del papel.
   *
   * Era un booleano cuando el único cuerpo posible era el doble. Con los
   * tamaños configurables por sección hacen falta los ocho.
   */
  escala: number;
  negrita: boolean;
}

/**
 * Cuántos bytes de argumento lleva cada comando.
 *
 * Hay que consumir las secuencias ENTERAS. Reconocer solo unas pocas deja que
 * el resto se cuele como texto: `FS .` pintaba un "." y `ESC M n` una "M"
 * pegados al nombre del negocio, que en pantalla se leían como errores de
 * diseño sin serlo.
 */
const ARGS_ESC: Record<string, number> = {
  "@": 0,
  "!": 1, M: 1, E: 1, G: 1, a: 1, t: 1, r: 1, "{": 1,
  "2": 0, "3": 1, J: 1, d: 1, "-": 1, c: 2, "=": 1, R: 1,
  p: 3, D: 0, S: 0, V: 1,
};
const ARGS_GS: Record<string, number> = {
  "!": 1, B: 1, h: 1, w: 1, f: 1, H: 1, k: 1, L: 2,
  V: 2, r: 1, a: 1, W: 2,
};
const ARGS_FS: Record<string, number> = { ".": 0, "&": 0, "-": 1, "!": 1, C: 1 };

const ESC = "\x1b";
const GS = "\x1d";
const FS = "\x1c";

/** Convierte los bytes que se le mandan a la impresora en líneas dibujables. */
export function parseEscPos(bytes: Uint8Array): PreviewLine[] {
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += String.fromCharCode(bytes[i] ?? 0);
  }

  const lineas: PreviewLine[] = [];
  let buf = "";
  let sangria = 0;
  let escala = 1;
  let negrita = false;

  /** Estilo con el que se escribió el texto de la línea en curso. */
  let estiloLinea: { escala: number; negrita: boolean } | null = null;

  const empujar = () => {
    lineas.push({
      sangria,
      texto: buf,
      escala: estiloLinea?.escala ?? escala,
      negrita: estiloLinea?.negrita ?? negrita,
    });
    buf = "";
    sangria = 0;
    estiloLinea = null;
  };

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === undefined) break;

    if (c === ESC || c === GS || c === FS) {
      const cmd = s[i + 1] ?? "";
      const tabla = c === ESC ? ARGS_ESC : c === GS ? ARGS_GS : ARGS_FS;

      if (c === GS && cmd === "!") {
        // GS ! n — nibble alto = ancho-1, bajo = alto-1. El ancho es el que
        // decide cuántas columnas ocupa cada carácter.
        escala = (s.charCodeAt(i + 2) >> 4) + 1;
      } else if (c === ESC && cmd === "E") {
        negrita = s.charCodeAt(i + 2) === 1;
      }

      // Desconocido: se asume 1 argumento. Pasarse por uno se come un carácter;
      // quedarse corto vuelca el comando entero como texto, que es peor.
      i += 1 + (tabla[cmd] ?? 1);
      continue;
    }

    if (c === "\n") {
      empujar();
      continue;
    }
    if (c === "\r" || c.charCodeAt(0) < 32) continue;

    /**
     * Un espacio antes de que empiece el texto Y con el cuerpo todavía normal
     * es relleno de alineación: se cuenta aparte para dibujarlo a su tamaño.
     *
     * La condición `escala === 1` es la que distingue el relleno de los
     * espacios que SÍ van agrandados —la sangría de un nombre de plato que se
     * parte en dos líneas—, porque esos llegan con el cuerpo grande ya activo.
     */
    if (buf === "" && c === " " && escala === 1) {
      sangria++;
      continue;
    }

    // El estilo se congela con el primer carácter imprimible: para cuando llega
    // el salto de línea, el encoder ya lo ha restablecido.
    if (estiloLinea === null) {
      estiloLinea = { escala, negrita };
    }
    buf += c;
  }

  if (buf.trim()) empujar();
  return lineas;
}
