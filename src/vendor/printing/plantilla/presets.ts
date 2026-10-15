/**
 * Diseños listos para aplicar de un toque.
 *
 * Todos salen de la plantilla de fábrica del documento con unos cuantos ajustes
 * a la vista, no de una lista escrita aparte: así, cuando el catálogo gane un
 * bloque, los presets lo heredan en su lugar en vez de quedarse sin él.
 *
 * El primero de cada documento es el de fábrica (`id: "fabrica"`): es al que
 * vuelve «Restablecer».
 */

import { plantillaPorDefecto } from "./leer";
import type { DocumentKind, TemplateBlock, TicketTemplate } from "./tipos";

export interface PresetDePlantilla {
  id: string;
  nombre: string;
  /** Para quien es, en una frase. */
  descripcion: string;
  plantilla: TicketTemplate;
}

type Cambio = Partial<Omit<TemplateBlock, "id" | "type">>;

/**
 * La plantilla de fábrica con cambios por id de bloque. Un id que no existe es
 * un error de este archivo, no de quien lo usa, y lo delata el test.
 */
function variante(
  kind: DocumentKind,
  cambios: Record<string, Cambio>,
  quitar: (b: TemplateBlock) => boolean = () => false,
): TicketTemplate {
  const base = plantillaPorDefecto(kind);
  return {
    ...base,
    blocks: base.blocks
      .filter((b) => !quitar(b))
      .map((b) => {
        const c = cambios[b.id];
        if (!c) return b;
        // Las opciones se funden: pedir `format: short` no debe perder el resto.
        const options = b.options || c.options ? { ...b.options, ...c.options } : undefined;
        return { ...b, ...c, ...(options ? { options } : {}) };
      }),
  };
}

const fabrica = (kind: DocumentKind, nombre: string, descripcion: string): PresetDePlantilla => ({
  id: "fabrica",
  nombre,
  descripcion,
  plantilla: plantillaPorDefecto(kind),
});

const DE_COBRO = (kind: "precuenta" | "comprobante"): PresetDePlantilla[] => [
  fabrica(kind, "Clásica", "El diseño con el que viene Mando."),
  {
    id: "compacta",
    nombre: "Compacta",
    descripcion:
      "Sin dirección ni RUC, con el número corto y la fecha en una sola línea. Gasta menos papel.",
    plantilla: variante(kind, {
      address: { visible: false },
      business_document: { visible: false },
      order_number: { options: { format: "short" } },
      date: { label: "", options: { format: "datetime" } },
    }),
  },
  {
    id: "precio-unidad",
    nombre: "Con precio por unidad",
    descripcion: "Cuando se piden varios del mismo, añade cuánto cuesta cada uno.",
    plantilla: variante(kind, { items: { options: { showUnitPrice: true } } }),
  },
];

export const PRESETS: Record<DocumentKind, PresetDePlantilla[]> = {
  comanda: [
    fabrica("comanda", "Clásica", "El diseño con el que viene Mando."),
    {
      id: "solo-cocina",
      nombre: "Solo cocina",
      descripcion:
        "Sin nombre del negocio ni título: la mesa y los platos en grande, lo demás en chico.",
      plantilla: variante("comanda", {
        business_name: { visible: false },
        title: { visible: false },
        order_number: { visible: false },
        table_service: { size: "large" },
        date: { size: "normal" },
        attendant: { size: "normal" },
        items: { size: "large" },
      }),
    },
    {
      id: "ahorra-papel",
      nombre: "Ahorra papel",
      descripcion: "Todo en cuerpo normal salvo los platos, que van altos: se leen igual y gastan menos.",
      plantilla: variante("comanda", {
        business_name: { size: "normal" },
        order_number: { size: "normal" },
        items: { size: "tall" },
      }),
    },
  ],
  precuenta: DE_COBRO("precuenta"),
  comprobante: DE_COBRO("comprobante"),
  cierre: [
    fabrica(
      "cierre",
      "Con cada egreso",
      "Ventas por método, en qué se fue cada egreso y la cuenta del cajón, con el resultado en grande.",
    ),
    {
      id: "sin-egresos",
      nombre: "Sin detalle de egresos",
      descripcion: "Lo mismo, pero los egresos van solo en la cuenta del cajón, sin una línea por cada uno.",
      plantilla: variante("cierre", { movements: { visible: false } }),
    },
    {
      id: "corto",
      nombre: "Corto",
      descripcion: "Sin títulos ni signos, las comandas solo contadas y sin rayas dobles.",
      plantilla: variante(
        "cierre",
        {
          // Corto es corto: sin detalle de egresos aunque el de fabrica lo traiga.
          movements: { visible: false },
          sales_by_method: { label: "" },
          cash_count: { label: "", options: { showSigns: false } },
          orders_list: { options: { mode: "count" } },
        },
        (b) => b.type === "separator" && b.options?.style === "double",
      ),
    },
  ],
};
