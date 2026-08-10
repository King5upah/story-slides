import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoryDeck, type StorySlide } from "story-slides";

const slides: StorySlide[] = [
  {
    type: "title",
    icon: "📱",
    heading: "story-slides",
    subheading: "Tap-to-advance slides for structured content",
  },
  {
    type: "text",
    heading: "What is this?",
    body: "A tiny React component that turns any structured content into an Instagram-Stories-like deck — no timers, the reader controls the pace.",
  },
  {
    type: "highlight",
    content: "<StoryDeck slides={...} />",
    caption: "That's the whole API surface",
  },
  {
    type: "example",
    text: "Tap the right edge →",
    note: "Tap the left edge to go back",
  },
  {
    type: "table",
    caption: "Slide types",
    headers: ["Type", "Use for"],
    rows: [
      ["title", "opening card"],
      ["text", "a paragraph"],
      ["highlight", "a formula / key fact"],
      ["example", "a short illustrative line"],
      ["table", "structured data"],
      ["tip", "a callout"],
      ["quiz", "an interactive check"],
      ["cta", "closing card with a button"],
    ],
  },
  {
    type: "tip",
    body: "Quiz slides block advancing until the reader answers — a light commitment device.",
  },
  {
    type: "quiz",
    question: "Which slide type blocks the tap-to-advance until answered?",
    options: ["text", "quiz", "tip"],
    correct: 1,
    explanation: "Exactly — quiz slides lock the next-tap until the reader picks an answer and sees feedback.",
  },
  {
    type: "cta",
    heading: "That's it!",
    body: "Swap these slides for your own content — grammar lessons, onboarding, product tours, whatever.",
    label: "Done →",
  },
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoryDeck
      slides={slides}
      title="story-slides"
      icon="📱"
      accentColor="#7d2033"
      onExit={() => alert("onExit fired")}
      onComplete={() => alert("onComplete fired 🎉")}
    />
  </StrictMode>
);
