import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoryDeck, CardDeck, type StorySlide, type BarajaCard } from "story-slides";

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

const cards: BarajaCard[] = [
  { prompt: "CardDeck", widget: { type: "flipCard", front: "ciao", back: "hola\n\n\"Ciao! Come stai?\"" } },
  {
    widget: {
      type: "singleChoiceQuiz",
      question: "¿Cómo se dice \"gracias\" en italiano?",
      options: ["Ciao", "Grazie", "Acqua", "Prego"],
      correctIndex: 1,
      explanation: "\"Grazie\" significa gracias.",
    },
  },
  { widget: { type: "trueFalse", statement: "\"Acqua\" significa agua.", isTrue: true } },
];

const useCardDeck = new URLSearchParams(location.search).has("cards");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {useCardDeck ? (
      <CardDeck
        cards={cards}
        title="CardDeck demo"
        icon="🃏"
        accentColor="#2d6a4f"
        onExit={() => alert("onExit fired")}
        onFinish={(result) => alert(`onFinish: ${result.correct}/${result.graded} correctas`)}
      />
    ) : (
      <StoryDeck
        slides={slides}
        title="story-slides"
        icon="📱"
        accentColor="#7d2033"
        onExit={() => alert("onExit fired")}
        onComplete={() => alert("onComplete fired 🎉")}
      />
    )}
  </StrictMode>
);
