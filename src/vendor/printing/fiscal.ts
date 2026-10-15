/**
 * Lo fiscal que no depende de cómo se dibuje: el monto en letras, el número del
 * comprobante y los nombres que SUNAT les da a los documentos.
 *
 * Vive aquí, y no en `apps/web`, porque el papel y la pantalla tienen que decir
 * lo mismo: la web tenía su propio `amountToWords` junto a la hoja HTML de la
 * boleta, y el día que el agente de impresión también imprima boletas habría
 * habido dos conversores de números a letras que podían discrepar.
 * `amountToWords` es LA implementación; el panel la importa de aquí.
 */

import type { DatosFiscales } from "./plantilla/tipos";

// ─── Monto en letras (obligatorio en la representación impresa) ─────────────

const UNIDADES = [
  "", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE",
  "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE",
  "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE",
];
const VEINTI = [
  "", "VEINTIUNO", "VEINTIDÓS", "VEINTITRÉS", "VEINTICUATRO", "VEINTICINCO",
  "VEINTISÉIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE",
];
const DECENAS = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const CENTENAS = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

/**
 * De 1 a 99. Con `apocope`, el «uno» final se acorta porque va delante de un
 * sustantivo: «veintiún mil», «treinta y un millones». Sin él (el último
 * grupo) se queda «uno», como lo escribía la hoja HTML de la web.
 */
function decenasYUnidades(n: number, apocope: boolean): string {
  if (n < 20) return apocope && n === 1 ? "UN" : UNIDADES[n]!;
  if (n === 20) return "VEINTE";
  if (n < 30) return apocope && n === 21 ? "VEINTIÚN" : VEINTI[n - 20]!;
  const d = Math.floor(n / 10);
  const u = n % 10;
  return DECENAS[d]! + (u > 0 ? ` Y ${apocope && u === 1 ? "UN" : UNIDADES[u]}` : "");
}

/** De 1 a 999. */
function centenas(n: number, apocope: boolean): string {
  if (n === 100) return "CIEN";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  return [c > 0 ? CENTENAS[c] : "", resto > 0 ? decenasYUnidades(resto, apocope) : ""]
    .filter(Boolean)
    .join(" ");
}

/** La palabra de cada moneda en el monto en letras. */
const NOMBRE_DE_MONEDA = { PEN: "SOLES", USD: "DÓLARES AMERICANOS" } as const;

/**
 * El importe en letras con los céntimos como fracción, como lo pide SUNAT:
 * `15.5` → «QUINCE CON 50/100 SOLES». Devuelve MAYÚSCULAS con acentos; el
 * ticket térmico los quita al imprimir, la pantalla los conserva.
 *
 * Nunca lanza: un valor que no es número se lee como 0, y uno negativo por su
 * valor absoluto (un descuento no se dice «menos»).
 *
 * Diferencias con la versión de la web, que se porta aquí:
 * - los céntimos se sacan de un entero (`Math.round(x * 100)`), así que
 *   `0.1 + 0.2` ya no da «29/100»;
 * - «uno» delante de «mil» y «millones» se acorta («VEINTIÚN MIL», que antes
 *   salía «VEINTIUNO MIL»);
 * - la moneda sale en mayúsculas («SOLES», no «Soles»).
 * Lo demás —«UN» para 1, «UNO» al final de 21, 31…— se conserva.
 */
export function amountToWords(
  amount: number | string | null | undefined,
  moneda: "PEN" | "USD" = "PEN",
): string {
  const n = Math.abs(Number(amount));
  const valido = Number.isFinite(n) ? n : 0;
  // El 1e-9 evita que 1.005 (que en binario es 1.00499999…) se redondee a la baja.
  const centimos = Math.round((valido + 1e-9) * 100);
  const entero = Math.floor(centimos / 100);
  const cents = String(centimos % 100).padStart(2, "0");
  const nombre = NOMBRE_DE_MONEDA[moneda] ?? NOMBRE_DE_MONEDA.PEN;

  if (entero === 0) return `CERO CON ${cents}/100 ${nombre}`;
  // Más de mil millones no existe en un ticket; mejor cifras que inventar letras.
  if (entero >= 1_000_000_000) return `${entero} CON ${cents}/100 ${nombre}`;

  const millones = Math.floor(entero / 1_000_000);
  const miles = Math.floor((entero % 1_000_000) / 1_000);
  const resto = entero % 1_000;

  const partes: string[] = [];
  if (millones > 0) {
    partes.push(millones === 1 ? "UN MILLÓN" : `${centenas(millones, true)} MILLONES`);
  }
  if (miles > 0) {
    partes.push(miles === 1 ? "MIL" : `${centenas(miles, true)} MIL`);
  }
  if (resto > 0) {
    partes.push(resto === 1 ? "UN" : centenas(resto, false));
  }
  return `${partes.join(" ")} CON ${cents}/100 ${nombre}`;
}

// ─── Número y tipo del comprobante ──────────────────────────────────────────

/**
 * El correlativo a 8 dígitos, como lo manda SUNAT: `15` → `00000015`. Si no es
 * numérico se deja tal cual (limpio): no se inventa un formato.
 */
export function correlativoDe(correlativo: string | number | null | undefined): string {
  const c = String(correlativo ?? "").trim();
  return /^\d+$/.test(c) ? c.padStart(8, "0") : c;
}

/** `B001-00000015`. Sin serie, solo el correlativo; sin ninguno, cadena vacía. */
export function numeroFiscal(
  serie: string | null | undefined,
  correlativo: string | number | null | undefined,
): string {
  const s = String(serie ?? "").trim().toUpperCase();
  const c = correlativoDe(correlativo);
  return s && c ? `${s}-${c}` : s || c;
}

/**
 * ¿Tiene serie y correlativo? Una boleta sin ellos no existe en SUNAT, y
 * entregarla en papel es entregar un comprobante falso: es la comprobación que
 * hacía `printElectronicDocument` en la web (`documentHasFiscalNumber`).
 */
export function tieneNumeroFiscal(
  fiscal: Pick<DatosFiscales, "serie" | "correlativo"> | null | undefined,
): boolean {
  return !!fiscal && String(fiscal.serie ?? "").trim() !== "" && correlativoDe(fiscal.correlativo) !== "";
}

/** Cómo se llama cada tipo de comprobante en su título y en su leyenda. */
export const TIPOS_DE_COMPROBANTE = {
  "01": { titulo: "FACTURA ELECTRÓNICA", nombre: "factura electrónica" },
  "03": { titulo: "BOLETA DE VENTA ELECTRÓNICA", nombre: "boleta de venta electrónica" },
} as const;

/** Un `tipoDoc` raro (un dato corrupto) se lee como boleta, que es lo común. */
export const tipoDeComprobante = (tipoDoc: unknown) =>
  tipoDoc === "01" ? TIPOS_DE_COMPROBANTE["01"] : TIPOS_DE_COMPROBANTE["03"];

/**
 * El documento del cliente como se lee en papel. Acepta el nombre («DNI») o el
 * código del catálogo 06 de SUNAT, que es lo que a veces se guarda.
 */
const TIPOS_DE_DOCUMENTO: Record<string, string> = {
  "1": "DNI",
  "4": "CE",
  "6": "RUC",
  "7": "PAS",
  A: "CDI",
  DNI: "DNI",
  RUC: "RUC",
  CE: "CE",
  PAS: "PAS",
  PASAPORTE: "PAS",
};

/** `"6"` → `"RUC"`. Lo que no se reconoce devuelve cadena vacía (sale «Doc.»). */
export function etiquetaDeTipoDocumento(tipo: string | null | undefined): string {
  return TIPOS_DE_DOCUMENTO[String(tipo ?? "").trim().toUpperCase()] ?? "";
}

/**
 * El número de documento que se manda cuando el comprador no se identifica
 * (`00000000`) no es un documento: no se imprime.
 */
export function esDocumentoAnonimo(numDoc: string | null | undefined): boolean {
  const n = String(numDoc ?? "").trim();
  return n === "" || n === "-" || /^0+$/.test(n);
}

// ─── Contenido del QR ───────────────────────────────────────────────────────

/** Código del catálogo 06 de SUNAT para el documento del adquirente. */
const CODIGO_DE_DOCUMENTO: Record<string, string> = {
  DNI: "1", CE: "4", RUC: "6", PAS: "7", CDI: "A",
};

const dosDecimales = (v: unknown) => (Number(v) || 0).toFixed(2);

/** `AAAA-MM-DD` en Lima, que es la fecha que SUNAT espera en el QR. */
function fechaIso(valor: unknown): string {
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor) && valor.length <= 10) {
    return valor.slice(0, 10);
  }
  const d = valor instanceof Date ? valor : new Date(String(valor ?? ""));
  if (Number.isNaN(d.getTime())) return "";
  try {
    // en-CA da AAAA-MM-DD directamente.
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(d);
  } catch {
    // Motores sin zonas horarias (Hermes): Lima es UTC-5 todo el año.
    return new Date(d.getTime() - 5 * 3600 * 1000).toISOString().slice(0, 10);
  }
}

/**
 * El contenido del QR de la representación impresa, en el formato que define
 * SUNAT: RUC del emisor | tipo | serie | número | IGV | total | fecha de emisión
 * | tipo de documento del adquirente | número | valor resumen (hash) |.
 *
 * POR QUÉ SE ARMA AQUÍ: Factpro a veces devuelve en `qr` la URL de una imagen y
 * no el contenido. Una térmica no puede imprimir una imagen remota, y una
 * boleta sin QR no es una representación impresa válida. Con estos datos —que
 * son los que el QR lleva dentro— el papel sale completo siempre.
 *
 * Devuelve cadena vacía si falta lo imprescindible (RUC, serie o número): un QR
 * que no identifica el comprobante es peor que ninguno.
 */
export function contenidoQrSunat(
  fiscal: Pick<
    DatosFiscales,
    "tipoDoc" | "serie" | "correlativo" | "igv" | "total" | "fechaEmision" | "cliente" | "hash"
  >,
  rucEmisor: string | null | undefined,
): string {
  const ruc = String(rucEmisor ?? "").replace(/\D/g, "");
  const serie = String(fiscal?.serie ?? "").trim().toUpperCase();
  const numero = String(fiscal?.correlativo ?? "").trim();
  if (!ruc || !serie || !numero) return "";

  const cliente = fiscal.cliente ?? null;
  const anonimo = esDocumentoAnonimo(cliente?.numDoc);
  const etiqueta = etiquetaDeTipoDocumento(cliente?.tipoDoc);
  const tipoAdquirente = anonimo ? "-" : (CODIGO_DE_DOCUMENTO[etiqueta] ?? "-");
  const numAdquirente = anonimo ? "-" : String(cliente?.numDoc ?? "").trim();

  return [
    ruc,
    fiscal.tipoDoc === "01" ? "01" : "03",
    serie,
    numero,
    dosDecimales(fiscal.igv),
    dosDecimales(fiscal.total),
    fechaIso(fiscal.fechaEmision),
    tipoAdquirente,
    numAdquirente,
    String(fiscal.hash ?? "").trim(),
    "",
  ].join("|");
}
