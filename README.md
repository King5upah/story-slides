# story-slides

Tap-to-advance story slides for structured content — an Instagram-Stories-like UX for React, with embedded quizzes, no autoplay timers, and a versioned protocol for sharing decks.

It grew out of a French-grammar lesson turned into a swipeable deck: instead of one long scrolling page, each idea gets its own slide, the reader controls the pace by tapping left/right, and a quiz slide can block progress until answered.

This repo is a monorepo with two independent packages:

| Package                                     | What it is                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| [`story-slides-protocol`](packages/protocol) | Deck format (types + serialize/validate/share). No React, no backend.    |
| [`story-slides-ui`](packages/ui)             | The `StoryDeck` React component. Depends on `story-slides-protocol`.     |

Install only the protocol if you're building your own renderer, or both if you just want the component.

## Why not autoplay?

Real Instagram Stories advance on a timer. For anything you actually need to *read* — a lesson, an onboarding flow, a product explainer — a timer works against you. `story-slides` keeps the visual language (segmented progress bar, tap zones, full-bleed cards) but advances only on tap.

## Install

```bash
npm install story-slides-ui story-slides-protocol
```

## Usage

```tsx
import { StoryDeck } from "story-slides-ui";
import type { DeckManifest } from "story-slides-protocol";

const deck: DeckManifest = {
  version: 1,
  id: "my-deck",
  title: "My deck",
  icon: "👋",
  accentColor: "#7d2033",
  slides: [
    { type: "title", icon: "👋", heading: "Welcome", subheading: "A quick tour" },
    { type: "text", heading: "Step 1", body: "Explain one idea per slide." },
    {
      type: "quiz",
      question: "Does this block advancing until answered?",
      options: ["No", "Yes"],
      correct: 1,
      explanation: "Yep — quiz slides lock the next tap until you answer.",
    },
    { type: "cta", heading: "Done", body: "Wire onComplete to whatever comes next.", label: "Continue →" },
  ],
};

<StoryDeck deck={deck} onExit={() => console.log("closed")} onComplete={() => console.log("finished")} />;
```

`StoryDeck` also accepts loose props (`slides`, `title`, `icon`, `accentColor`) instead of a full `deck` manifest, if you don't need the sharing protocol.

No Tailwind, no CSS framework required — styles ship as a scoped CSS module.

## Slide types

| Type        | Use for                                |
| ----------- | --------------------------------------- |
| `title`     | opening card                            |
| `text`      | a paragraph, optionally with a heading  |
| `highlight` | a formula / key fact in a callout box   |
| `example`   | a short illustrative line               |
| `table`     | structured data                         |
| `tip`       | a callout                               |
| `quiz`      | interactive check, blocks advancing     |
| `cta`       | closing card with a button              |

## Sharing decks

`story-slides-protocol` defines a versioned `DeckManifest` — the same JSON shape you pass to `<StoryDeck deck={...} />` — plus functions to serialize it, validate it, and pack it into a shareable URL. No backend needed: the whole deck lives in the link.

```ts
import {
  serializeDeck,
  deserializeDeck,
  buildShareURL,
  decodeDeckFromParam,
  readDeckFromLocation,
} from "story-slides-protocol";

// Export/import as plain JSON
const json = serializeDeck(deck);
const restored = deserializeDeck(json); // throws InvalidDeckError if malformed

// Share via link (base64url-encoded in a `?deck=` query param)
const link = buildShareURL("https://example.com/deck", deck);

// On the receiving page, at load time:
const shared = readDeckFromLocation(); // DeckManifest | null
```

The demo app wires this up end-to-end: it renders an example deck, and a "Share this deck" button generates a link that, when opened, reconstructs the exact same deck via `readDeckFromLocation`.

## Demo

```bash
git clone https://github.com/King5upah/story-slides.git
cd story-slides
npm install
npm run dev --workspace=demo
```

## License

MIT
