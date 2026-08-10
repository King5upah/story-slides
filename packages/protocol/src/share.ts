import { deserializeDeck, serializeDeck } from "./serialize";
import type { DeckManifest } from "./types";

const SHARE_PARAM = "deck";

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeDeckToParam(manifest: DeckManifest): string {
  return toBase64Url(serializeDeck(manifest));
}

export function decodeDeckFromParam(param: string): DeckManifest {
  return deserializeDeck(fromBase64Url(param));
}

export function buildShareURL(baseURL: string, manifest: DeckManifest): string {
  const url = new URL(baseURL);
  url.searchParams.set(SHARE_PARAM, encodeDeckToParam(manifest));
  return url.toString();
}

export function readDeckFromLocation(location: Pick<Location, "href"> = window.location): DeckManifest | null {
  const url = new URL(location.href);
  const param = url.searchParams.get(SHARE_PARAM);
  if (!param) return null;
  return decodeDeckFromParam(param);
}
