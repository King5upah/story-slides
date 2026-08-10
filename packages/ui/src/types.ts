import type { DeckManifest, StorySlide } from "story-slides-protocol";

export type { StorySlide, DeckManifest };

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
