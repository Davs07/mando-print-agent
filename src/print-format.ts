/**
 * «Formato avanzado»: lo que el negocio configura en el panel de Mando y este
 * agente tiene que obedecer al dibujar el ticket.
 *
 * ⚠️ COPIA. El original vive en el monorepo, en
 * `apps/web/shared/domain/print-format.ts` y `shared/domain/business-preferences.ts`.
 * Está duplicado porque este agente es un repositorio aparte y todavía no hay un
 * paquete compartido publicado. Si cambias uno, cambia el otro — es exactamente
 * la duplicación que el paquete `@mando/printing` viene a eliminar.
 */

export type PrintSectionKey =
  | 'logo'
  | 'header'
  | 'order_info'
  | 'meta'
  | 'items'
  | 'notes'
  | 'total'
  | 'footer'

export interface PrintFormatConfig {
  boldBusinessName?: boolean
  boldTitle?: boolean
  boldOrderNumber?: boolean
  boldItemNames?: boolean
  boldTotal?: boolean
  boldOrderNotes?: boolean
  boldCustomText?: boolean
  uppercase?: boolean
  extraBold?: boolean
  sectionOrder?: PrintSectionKey[]
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
  // `notes` antes que `items`: la nota del pedido es contexto para los platos.
  sectionOrder: ['logo', 'header', 'order_info', 'meta', 'notes', 'items', 'footer'],
}

export const DEFAULT_RECEIPT_FORMAT: PrintFormatConfig = {
  boldBusinessName: true,
  boldTitle: true,
  boldOrderNumber: false,
  boldItemNames: false,
  boldTotal: true,
  boldOrderNotes: false,
  boldCustomText: false,
  uppercase: false,
  sectionOrder: ['logo', 'header', 'order_info', 'meta', 'items', 'notes', 'total', 'footer'],
}

/**
 * El formato llega desde la API como JSON crudo, tal cual se guardó.
 *
 * Nunca lanza: un ticket que no sale es peor que un ticket con el formato por
 * defecto. Un negocio con la preferencia corrupta debe seguir imprimiendo.
 */
export function leerFormato(
  raw: string | null | undefined,
  porDefecto: PrintFormatConfig,
): PrintFormatConfig {
  if (!raw) return { ...porDefecto }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...porDefecto }
    }
    return { ...porDefecto, ...(parsed as PrintFormatConfig) }
  } catch {
    return { ...porDefecto }
  }
}

/**
 * En qué orden se dibujan las secciones.
 *
 * Descarta lo desconocido y lo duplicado, y añade al final lo que el negocio no
 * tenga guardado — sin esto, una sección nueva desaparecería para todos los
 * negocios que alguna vez tocaron el panel.
 */
export function seccionesOrdenadas(
  fmt: Pick<PrintFormatConfig, 'sectionOrder'>,
  porDefecto: readonly PrintSectionKey[],
): PrintSectionKey[] {
  const conocidas = new Set<PrintSectionKey>(porDefecto)
  const guardadas = Array.isArray(fmt.sectionOrder) ? fmt.sectionOrder : []

  const orden: PrintSectionKey[] = []
  const vistas = new Set<PrintSectionKey>()

  for (const clave of guardadas) {
    if (!conocidas.has(clave) || vistas.has(clave)) continue
    orden.push(clave)
    vistas.add(clave)
  }
  for (const clave of porDefecto) {
    if (!vistas.has(clave)) orden.push(clave)
  }
  return orden
}
