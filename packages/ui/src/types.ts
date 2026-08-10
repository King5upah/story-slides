import type { DeckManifest, StorySlide, BarajaCard, DeckResult } from "story-slides-protocol";

export type { StorySlide, DeckManifest, BarajaCard, DeckResult };

export interface StoryDeckProps {
  /** A full deck manifest (e.g. loaded via story-slides-protocol). Overrides slides/title/icon/accentColor below. */
  deck?: DeckManifest;
  slides?: StorySlide[];
  accentColor?: string;
  title?: string;
  icon?: string;
  onExit?: () => void;
  onComplete?: () => void;
}

export interface CardDeckProps {
  cards: BarajaCard[];
  accentColor?: string;
  title?: string;
  icon?: string;
  onExit?: () => void;
  onFinish?: (result: DeckResult) => void;
}
