import type { TicketItem } from "../types";

/**
 * Quita acentos: las térmicas los sacan como basura salvo que se acierte con la
 * página de códigos, y acertar depende del modelo. Sin acentos siempre se lee.
 */
export function escapeText(value?: string | number | null): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Parte un texto en líneas de `maxWidth` caracteres, cortando por espacios. */
export function wrapText(text: string, maxWidth: number): string[] {
  if (text.length <= maxWidth) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  const partirLarga = (word: string) => {
    lines.push(word.substring(0, maxWidth));
    return word.substring(maxWidth) || "";
  };

  for (const word of words) {
    if (!current) {
      current = word.length >= maxWidth ? partirLarga(word) : word;
    } else if ((current + " " + word).length <= maxWidth) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word.length >= maxWidth ? partirLarga(word) : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export interface KitchenGroup {
  round: number;
  station: string;
  items: TicketItem[];
}

/**
 * Agrupa los platos por ronda y estación.
 *
 * La cocina y la barra preparan cosas distintas, y una mesa que pide dos veces
 * genera dos rondas: mezclarlas haría que el cocinero no distinga lo que acaba
 * de entrar de lo que ya está hecho.
 */
export function groupKitchenItems(items: TicketItem[]): KitchenGroup[] {
  const groups: KitchenGroup[] = [];

  for (const item of items ?? []) {
    if (item.status === "CANCELADO") continue;
    const round = item.roundNumber ?? 1;
    const station = item.preparationStation ?? "COCINA";

    const existing = groups.find(
      (g) => g.round === round && g.station === station,
    );
    if (existing) existing.items.push(item);
    else groups.push({ round, station, items: [item] });
  }

  return groups.sort((a, b) =>
    a.round !== b.round
      ? a.round - b.round
      : a.station.localeCompare(b.station),
  );
}
