/// A configurable action a tappable slide/widget can carry — `url` and
/// `deeplink` are just data as far as the SDK is concerned, it never opens
/// either on its own. `actionId` is an app-defined identifier the host app
/// interprets itself. All three funnel through the same `onAction` callback.
export type CTAAction =
  | { kind: "url"; url: string }
  | { kind: "deeplink"; url: string }
  | { kind: "actionId"; id: string; payload?: Record<string, string> };

export type StorySlide =
  | { type: "title"; icon?: string; heading: string; subheading?: string; action?: CTAAction }
  | { type: "text"; heading?: string; body: string; action?: CTAAction }
  | { type: "highlight"; content: string; caption?: string; action?: CTAAction }
  | { type: "example"; text: string; note?: string; action?: CTAAction }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string; action?: CTAAction }
  | { type: "tip"; body: string; action?: CTAAction }
  | { type: "quiz"; question: string; options: string[]; correct: number; explanation: string; action?: CTAAction }
  | { type: "cta"; heading: string; body: string; label: string; action?: CTAAction };

export const DECK_MANIFEST_VERSION = 1 as const;

export interface DeckManifest {
  version: typeof DECK_MANIFEST_VERSION;
  id: string;
  title?: string;
  icon?: string;
  accentColor?: string;
  slides: StorySlide[];
}

/// A widget shown on a single card of a `CardDeck` — the extensible,
/// graded/interactive counterpart to `StorySlide`. Same visual language
/// (full-bleed, centered, no chrome); more kinds can be added over time.
export type CardWidget =
  | { type: "singleChoiceQuiz"; question: string; options: string[]; correctIndex: number; explanation?: string; action?: CTAAction }
  | { type: "multiChoiceQuiz"; question: string; options: string[]; correctIndices: number[]; explanation?: string; action?: CTAAction }
  | { type: "trueFalse"; statement: string; isTrue: boolean; explanation?: string; action?: CTAAction }
  | { type: "fillInBlank"; prompt: string; answer: string; hint?: string; action?: CTAAction }
  | { type: "flipCard"; front: string; back: string; action?: CTAAction }
  | { type: "counter"; label: string; value: number; total?: number; action?: CTAAction }
  | { type: "rating"; label: string; value: number; maxValue: number; action?: CTAAction };

/// Whether a `CardDeck`'s shared left/right tap zones resolve this card by
/// themselves, or the card has its own tappable controls to answer with.
export type TapBehavior = "revealThenAdvance" | "advanceImmediately" | "requiresInteraction";

export function tapBehaviorFor(widget: CardWidget): TapBehavior {
  switch (widget.type) {
    case "flipCard":
      return "revealThenAdvance";
    case "counter":
    case "rating":
      return "advanceImmediately";
    default:
      return "requiresInteraction";
  }
}

export function isGraded(widget: CardWidget): boolean {
  switch (widget.type) {
    case "singleChoiceQuiz":
    case "multiChoiceQuiz":
    case "trueFalse":
    case "fillInBlank":
      return true;
    default:
      return false;
  }
}

/// A single card in a `CardDeck` — an optional context label plus the
/// widget that renders its content.
export interface BarajaCard {
  id?: string;
  prompt?: string;
  widget: CardWidget;
}

/// Score summary reported once a `CardDeck` run is finished.
export interface DeckResult {
  total: number;
  graded: number;
  correct: number;
}
