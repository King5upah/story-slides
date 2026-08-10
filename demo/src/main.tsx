import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoryDeck } from "story-slides-ui";
import { buildShareURL, readDeckFromLocation, type DeckManifest } from "story-slides-protocol";

const exampleDeck: DeckManifest = {
  version: 1,
  id: "story-slides-intro",
  title: "story-slides",
  icon: "📱",
  accentColor: "#7d2033",
  slides: [
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
      content: "<StoryDeck deck={manifest} />",
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
      body: "Swap these slides for your own content — grammar lessons, onboarding, product tours, whatever. Try the share button below.",
      label: "Done →",
    },
  ],
};

// If the page was opened with a shared deck link (?deck=...), render that instead of the built-in example.
let deck: DeckManifest;
try {
  deck = readDeckFromLocation() ?? exampleDeck;
} catch {
  deck = exampleDeck;
}

function ShareBar({ deck }: { deck: DeckManifest }) {
  return (
    <button
      onClick={() => {
        const url = buildShareURL(window.location.origin + window.location.pathname, deck);
        navigator.clipboard?.writeText(url).catch(() => {});
        window.prompt("Share this deck with a link:", url);
      }}
      style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        padding: "8px 16px",
        borderRadius: 999,
        border: "none",
        background: "white",
        color: "#1c2b4b",
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,.3)",
      }}
    >
      🔗 Share this deck
    </button>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoryDeck deck={deck} onExit={() => alert("onExit fired")} onComplete={() => alert("onComplete fired 🎉")} />
    <ShareBar deck={deck} />
  </StrictMode>
);
