import type { DeckManifest, StorySlide, BarajaCard, DeckResult, CTAAction } from "story-slides-protocol";

export type { StorySlide, DeckManifest, BarajaCard, DeckResult, CTAAction };

export interface StoryDeckProps {
  /** A full deck manifest (e.g. loaded via story-slides-protocol). Overrides slides/title/icon/accentColor below. */
  deck?: DeckManifest;
  slides?: StorySlide[];
  accentColor?: string;
  title?: string;
  icon?: string;
  onExit?: () => void;
  onComplete?: () => void;
  /** Fired when a slide with an `action` resolves (cta tapped, quiz answered). The SDK never opens url/deeplink itself. */
  onAction?: (action: CTAAction, context: { index: number; slide: StorySlide }) => void;
}

export interface CardDeckProps {
  cards: BarajaCard[];
  accentColor?: string;
  title?: string;
  icon?: string;
  onExit?: () => void;
  onFinish?: (result: DeckResult) => void;
  /** Fired when a card with an `action` resolves. The SDK never opens url/deeplink itself. */
  onAction?: (action: CTAAction, context: { index: number; card: BarajaCard }) => void;
}
