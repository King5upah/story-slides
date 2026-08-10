export type StorySlide =
  | { type: "title"; icon?: string; heading: string; subheading?: string }
  | { type: "text"; heading?: string; body: string }
  | { type: "highlight"; content: string; caption?: string }
  | { type: "example"; text: string; note?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "tip"; body: string }
  | { type: "quiz"; question: string; options: string[]; correct: number; explanation: string }
  | { type: "cta"; heading: string; body: string; label: string };

export const DECK_MANIFEST_VERSION = 1 as const;

export interface DeckManifest {
  version: typeof DECK_MANIFEST_VERSION;
  id: string;
  title?: string;
  icon?: string;
  accentColor?: string;
  slides: StorySlide[];
}
