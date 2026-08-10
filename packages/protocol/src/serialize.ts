import { DECK_MANIFEST_VERSION, type DeckManifest, type StorySlide } from "./types";

export class InvalidDeckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDeckError";
  }
}

const SLIDE_REQUIRED_FIELDS: Record<StorySlide["type"], string[]> = {
  title: ["heading"],
  text: ["body"],
  highlight: ["content"],
  example: ["text"],
  table: ["headers", "rows"],
  tip: ["body"],
  quiz: ["question", "options", "correct", "explanation"],
  cta: ["heading", "body", "label"],
};

function assertValidSlide(slide: unknown, index: number): asserts slide is StorySlide {
  if (typeof slide !== "object" || slide === null || !("type" in slide)) {
    throw new InvalidDeckError(`slides[${index}] is not a valid slide object`);
  }
  const type = (slide as { type: unknown }).type;
  if (typeof type !== "string" || !(type in SLIDE_REQUIRED_FIELDS)) {
    throw new InvalidDeckError(`slides[${index}] has an unknown type: ${String(type)}`);
  }
  for (const field of SLIDE_REQUIRED_FIELDS[type as StorySlide["type"]]) {
    if (!(field in (slide as Record<string, unknown>))) {
      throw new InvalidDeckError(`slides[${index}] (type "${type}") is missing required field "${field}"`);
    }
  }
}

export function assertValidDeck(value: unknown): asserts value is DeckManifest {
  if (typeof value !== "object" || value === null) {
    throw new InvalidDeckError("deck manifest must be an object");
  }
  const manifest = value as Record<string, unknown>;
  if (manifest.version !== DECK_MANIFEST_VERSION) {
    throw new InvalidDeckError(
      `unsupported deck manifest version: ${String(manifest.version)} (expected ${DECK_MANIFEST_VERSION})`
    );
  }
  if (typeof manifest.id !== "string" || manifest.id.length === 0) {
    throw new InvalidDeckError("deck manifest is missing a non-empty string \"id\"");
  }
  if (!Array.isArray(manifest.slides)) {
    throw new InvalidDeckError("deck manifest is missing a \"slides\" array");
  }
  manifest.slides.forEach((slide, i) => assertValidSlide(slide, i));
}

export function serializeDeck(manifest: DeckManifest): string {
  return JSON.stringify(manifest);
}

export function deserializeDeck(json: string): DeckManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new InvalidDeckError("deck manifest is not valid JSON");
  }
  assertValidDeck(parsed);
  return parsed;
}
