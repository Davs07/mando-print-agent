/**
 * Tipos de `@point-of-sale/receipt-printer-encoder`, que se distribuye sin
 * declaraciones.
 *
 * Se declara la superficie que usamos: así un método mal escrito o un argumento
 * de más se detectan al compilar, que es justo lo que no queremos descubrir con
 * la impresora delante. La alternativa —`@ts-ignore` sobre el import, que es lo
 * que hacía `apps/web`— apaga el chequeo entero.
 *
 * Vive en este paquete para que lo hereden todos los consumidores. Si hace falta
 * un método nuevo del encoder, se añade aquí.
 */
declare module '@point-of-sale/receipt-printer-encoder' {
  export type EncoderLanguage = 'esc-pos' | 'star-prnt' | 'star-line';
  export type EncoderAlignment = 'left' | 'center' | 'right';

  export interface ReceiptPrinterEncoderOptions {
    language?: EncoderLanguage;
    columns?: number;
    printerModel?: string;
    feedBeforeCut?: number;
    imageMode?: 'column' | 'raster';
  }

  /** Todos los métodos devuelven el propio encoder: la API es fluida. */
  export interface Encoder {
    initialize(): Encoder;
    codepage(codepage: string): Encoder;
    text(value: string): Encoder;
    newline(count?: number): Encoder;
    line(value: string): Encoder;
    rule(options?: { style?: 'single' | 'double'; width?: number }): Encoder;
    align(alignment: EncoderAlignment): Encoder;
    /**
     * Fuente A (normal) o B (mas estrecha). La libreria RECALCULA las columnas
     * con ella: 32 -> 42 en 58mm y 48 -> 64 en 80mm.
     */
    font(type: 'A' | 'B'): Encoder;
    bold(enabled?: boolean): Encoder;
    underline(enabled?: boolean): Encoder;
    invert(enabled?: boolean): Encoder;
    width(multiplier: number): Encoder;
    height(multiplier: number): Encoder;
    size(width: number, height?: number): Encoder;
    table(
      columns: unknown[],
      rows: unknown[][],
    ): Encoder;
    barcode(value: string, symbology: string, height?: number): Encoder;
    qrcode(value: string, options?: unknown): Encoder;
    image(
      data: unknown,
      width: number,
      height: number,
      algorithm?: string,
      threshold?: number,
    ): Encoder;
    cut(type?: 'full' | 'partial'): Encoder;
    pulse(device?: number, on?: number, off?: number): Encoder;
    raw(bytes: number[] | Uint8Array): Encoder;
    /** Cierra la construcción y devuelve los bytes listos para el transporte. */
    encode(): Uint8Array;
  }

  export default class ReceiptPrinterEncoder implements Encoder {
    constructor(options?: ReceiptPrinterEncoderOptions);
    initialize(): Encoder;
    codepage(codepage: string): Encoder;
    text(value: string): Encoder;
    newline(count?: number): Encoder;
    line(value: string): Encoder;
    rule(options?: { style?: 'single' | 'double'; width?: number }): Encoder;
    align(alignment: EncoderAlignment): Encoder;
    font(type: 'A' | 'B'): Encoder;
    bold(enabled?: boolean): Encoder;
    underline(enabled?: boolean): Encoder;
    invert(enabled?: boolean): Encoder;
    width(multiplier: number): Encoder;
    height(multiplier: number): Encoder;
    size(width: number, height?: number): Encoder;
    table(columns: unknown[], rows: unknown[][]): Encoder;
    barcode(value: string, symbology: string, height?: number): Encoder;
    qrcode(value: string, options?: unknown): Encoder;
    image(
      data: unknown,
      width: number,
      height: number,
      algorithm?: string,
      threshold?: number,
    ): Encoder;
    cut(type?: 'full' | 'partial'): Encoder;
    pulse(device?: number, on?: number, off?: number): Encoder;
    raw(bytes: number[] | Uint8Array): Encoder;
    encode(): Uint8Array;
  }
}
