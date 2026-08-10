import type { BarajaCard } from "./types";

/// A `BarajaCard` deck in its shareable, file-based form — the same shape
/// the Swift SDK (story-slides-swift) produces, so a deck exported from one
/// platform can be read on the other.
export interface ShareableDeck {
  name: string;
  cards: BarajaCard[];
}

export function toShareableJSON(deck: ShareableDeck): string {
  return JSON.stringify(deck, null, 2);
}

export function fromShareableJSON(json: string): ShareableDeck {
  const parsed = JSON.parse(json);
  if (!parsed || typeof parsed.name !== "string" || !Array.isArray(parsed.cards)) {
    throw new Error("Invalid ShareableDeck JSON: expected { name: string, cards: BarajaCard[] }");
  }
  return parsed as ShareableDeck;
}

/// Triggers a browser download of `deck` as a `.json` file — the web
/// equivalent of the Swift SDK's `ShareableDeck.writeToTemporaryFile()`.
export function downloadShareableDeck(deck: ShareableDeck): void {
  const blob = new Blob([toShareableJSON(deck)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const safeName = deck.name.trim().replace(/\s+/g, "-") || "baraja";
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
