export type StorySlide =
  | { type: "title"; icon?: string; heading: string; subheading?: string }
  | { type: "text"; heading?: string; body: string }
  | { type: "highlight"; content: string; caption?: string }
  | { type: "example"; text: string; note?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "tip"; body: string }
  | { type: "quiz"; question: string; options: string[]; correct: number; explanation: string }
  | { type: "cta"; heading: string; body: string; label: string };

export interface StoryDeckProps {
  slides: StorySlide[];
  accentColor?: string;
  title?: string;
  icon?: string;
  onExit?: () => void;
  onComplete?: () => void;
}

/// A widget shown on a single card of a `CardDeck` — the extensible,
/// graded/interactive counterpart to `StorySlide`. Same visual language
/// (full-bleed, centered, no chrome); more kinds can be added over time.
export type CardWidget =
  | { type: "singleChoiceQuiz"; question: string; options: string[]; correctIndex: number; explanation?: string }
  | { type: "multiChoiceQuiz"; question: string; options: string[]; correctIndices: number[]; explanation?: string }
  | { type: "trueFalse"; statement: string; isTrue: boolean; explanation?: string }
  | { type: "fillInBlank"; prompt: string; answer: string; hint?: string }
  | { type: "flipCard"; front: string; back: string }
  | { type: "counter"; label: string; value: number; total?: number }
  | { type: "rating"; label: string; value: number; maxValue: number };

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

export interface CardDeckProps {
  cards: BarajaCard[];
  accentColor?: string;
  title?: string;
  icon?: string;
  onExit?: () => void;
  onFinish?: (result: DeckResult) => void;
}
