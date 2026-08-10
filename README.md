# story-slides

Tap-to-advance story slides for structured content — an Instagram-Stories-like UX for React, with no autoplay timers and a portable protocol for sharing decks across platforms (there's also a [Swift SDK](https://github.com/King5upah/story-slides-swift)).

It grew out of a French-grammar lesson turned into a swipeable deck: instead of one long scrolling page, each idea gets its own slide, the reader controls the pace by tapping left/right, and interactive slides can lock progress until answered.

This repo is a monorepo with two independent packages:

| Package                                      | What it is                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| [`story-slides-protocol`](packages/protocol)  | Deck formats (types + serialize/validate/share). No React, no backend.  |
| [`story-slides-ui`](packages/ui)              | `StoryDeck` and `CardDeck` React components. Depends on the protocol.   |

Install only the protocol if you're building your own renderer, or both if you just want the components.

## Two kinds of deck

- **`StoryDeck`** — a linear, mostly-read deck (title/text/table/highlight/tip/cta slides), with an optional `quiz` slide that locks the tap-to-advance until answered.
- **`CardDeck`** — a graded, interactive deck: flashcards, single/multi-choice quizzes, true/false, fill-in-the-blank, counters, ratings. Tracks a score and reports a `DeckResult` when finished.

Both follow the same interaction language: tap the right edge to advance, the left edge to go back. A card's own controls (like a quiz option) are the only other tappable surface — everything else, including revealing a flashcard's back, goes through the shared tap zones.

## Why not autoplay?

Real Instagram Stories advance on a timer. For anything you actually need to *read* — a lesson, an onboarding flow, a product explainer — a timer works against you. `story-slides` keeps the visual language (segmented progress bar, tap zones, full-bleed cards) but advances only on tap.

## Install

```bash
npm install story-slides-ui story-slides-protocol
```

## Usage — StoryDeck

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
      explanation: "Yep — picking an option locks in the answer and unlocks the next tap.",
    },
    { type: "cta", heading: "Done", body: "Wire onComplete to whatever comes next.", label: "Continue →" },
  ],
};

<StoryDeck deck={deck} onExit={() => console.log("closed")} onComplete={() => console.log("finished")} />;
```

`StoryDeck` also accepts loose props (`slides`, `title`, `icon`, `accentColor`) instead of a full `deck` manifest, if you don't need the sharing protocol.

## Usage — CardDeck

```tsx
import { CardDeck } from "story-slides-ui";
import type { BarajaCard } from "story-slides-protocol";

const cards: BarajaCard[] = [
  { prompt: "Italian", widget: { type: "flipCard", front: "ciao", back: "hello\n\n\"Ciao! Come stai?\"" } },
  {
    widget: {
      type: "singleChoiceQuiz",
      question: 'How do you say "thanks" in Italian?',
      options: ["Ciao", "Grazie", "Acqua", "Prego"],
      correctIndex: 1,
      explanation: '"Grazie" means thanks.',
    },
  },
];

<CardDeck
  cards={cards}
  title="Italian basics"
  icon="🃏"
  onFinish={(result) => console.log(`${result.correct}/${result.graded} correct`)}
/>;
```

No Tailwind, no CSS framework required — styles ship as a scoped CSS module.

## Slide & widget types

**StoryDeck slides:**

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

**CardDeck widgets:**

| Type              | Use for                                    |
| ----------------- | -------------------------------------------- |
| `flipCard`        | flashcard, tap to reveal the back            |
| `singleChoiceQuiz`| pick one correct option                      |
| `multiChoiceQuiz` | pick all correct options                     |
| `trueFalse`       | true/false statement                         |
| `fillInBlank`     | free-text answer                             |
| `counter`         | a running number                             |
| `rating`          | a star rating                                |

## Sharing decks

Sharing is entirely opt-in — the SDK just exposes the functions; whether (and how) an app lets a user share is up to that app. There are two independent protocols, one per deck kind:

**`DeckManifest`** (for `StoryDeck`) — pack a deck into a link, no backend needed:

```ts
import { serializeDeck, deserializeDeck, buildShareURL, readDeckFromLocation } from "story-slides-protocol";

const json = serializeDeck(deck);
const restored = deserializeDeck(json); // throws InvalidDeckError if malformed

const link = buildShareURL("https://example.com/deck", deck); // base64url-encoded in `?deck=`
const shared = readDeckFromLocation(); // DeckManifest | null, read on page load
```

**`ShareableDeck`** (for `CardDeck`) — export/import as a portable `.json` file, using the same shape the [Swift SDK](https://github.com/King5upah/story-slides-swift) reads and writes, so a deck exported from an iOS app opens correctly on the web and vice versa:

```ts
import { toShareableJSON, fromShareableJSON, downloadShareableDeck } from "story-slides-protocol";

downloadShareableDeck({ name: "my-deck", cards }); // triggers a browser download

const restored = fromShareableJSON(jsonString); // { name, cards }
```

The demo wires up both: the default view is a `StoryDeck` with a "Share this deck" link button; add `?cards` to the URL to see the `CardDeck` demo with a "Download deck" button.

## Actionable CTAs

Any slide/widget can carry an optional `action: CTAAction` — a `url`, a `deeplink`, or an app-defined `actionId`. The SDK never opens or navigates anywhere on its own; every kind funnels through the same `onAction` callback, so the host app decides what actually happens:

```ts
export type CTAAction =
  | { kind: "url"; url: string }
  | { kind: "deeplink"; url: string }
  | { kind: "actionId"; id: string; payload?: Record<string, string> };
```

```tsx
<StoryDeck
  deck={deck}
  onAction={(action) => {
    switch (action.kind) {
      case "url":
      case "deeplink":
        window.open(action.url, "_blank");
        break;
      case "actionId":
        handleAppAction(action.id, action.payload);
        break;
    }
  }}
/>
```

It fires at the same moment each slide/widget already resolves — a `cta` button tap, a quiz being answered, a flip card being revealed — no separate tap-handling mechanism. Same shape and same `onAction` model on `CardDeck`, and on the [Swift SDK](https://github.com/King5upah/story-slides-swift)'s `StoryDeckView`/`CardDeckView`.

## Demo

```bash
git clone https://github.com/King5upah/story-slides.git
cd story-slides
npm install
npm run dev --workspace=demo
```

## License

MIT
