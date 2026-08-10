# story-slides

Tap-to-advance story slides for structured content — an Instagram-Stories-like UX for React, with embedded quizzes and no autoplay timers. Also ships `CardDeck`, a sibling component for graded flashcard/quiz decks that follows the exact same tap-to-advance convention, and `ShareableDeck` helpers to export/import decks as portable JSON.

It grew out of a French-grammar lesson turned into a swipeable deck: instead of one long scrolling page, each idea gets its own slide, the reader controls the pace by tapping left/right, and a quiz slide can block progress until answered.

## Why not autoplay?

Real Instagram Stories advance on a timer. For anything you actually need to *read* — a lesson, an onboarding flow, a product explainer — a timer works against you. `story-slides` keeps the visual language (segmented progress bar, tap zones, full-bleed cards) but advances only on tap.

## Install

```bash
npm install story-slides
```

## Usage

```tsx
import { StoryDeck, type StorySlide } from "story-slides";

const slides: StorySlide[] = [
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
];

<StoryDeck
  slides={slides}
  title="My deck"
  icon="👋"
  accentColor="#7d2033"
  onExit={() => console.log("closed")}
  onComplete={() => console.log("finished")}
/>;
```

No Tailwind, no CSS framework required — styles ship as a scoped CSS module.

## Slide types

| Type        | Use for                              |
| ----------- | ------------------------------------- |
| `title`     | opening card                          |
| `text`      | a paragraph, optionally with a heading |
| `highlight` | a formula / key fact in a callout box |
| `example`   | a short illustrative line             |
| `table`     | structured data                       |
| `tip`       | a callout                             |
| `quiz`      | interactive check, blocks advancing   |
| `cta`       | closing card with a button            |

## CardDeck — graded flashcard/quiz decks

`StoryDeck` is for content you read. `CardDeck` is its sibling for content
you're *tested on* — flashcards, quizzes, true/false, fill-in-the-blank —
but it follows the exact same convention: full-bleed centered cards, tap
left/right to go back or advance, no "Continuar" buttons. The only tappable
elements are the actual choices (an option, a text field); everything else
— including flipping a card or acknowledging a stat — advances through the
same shared tap zones a story does.

```tsx
import { CardDeck, type BarajaCard } from "story-slides";

const cards: BarajaCard[] = [
  { prompt: "Italiano", widget: { type: "flipCard", front: "ciao", back: "hola" } },
  {
    widget: {
      type: "singleChoiceQuiz",
      question: "¿Cómo se dice \"gracias\" en italiano?",
      options: ["Ciao", "Grazie", "Acqua", "Prego"],
      correctIndex: 1,
      explanation: "\"Grazie\" significa gracias.",
    },
  },
];

<CardDeck
  cards={cards}
  title="Vocabulario A1"
  icon="🃏"
  accentColor="#2d6a4f"
  onExit={() => console.log("closed")}
  onFinish={(result) => console.log(`${result.correct}/${result.graded} correct`)}
/>;
```

Widget types: `singleChoiceQuiz`, `multiChoiceQuiz`, `trueFalse`,
`fillInBlank`, `flipCard`, `counter`, `rating`.

## Sharing a deck (ShareableDeck)

Any `BarajaCard[]` deck can be exported to a portable `.json` file and read
back — by this app, another app, or the Swift SDK
([story-slides-swift](https://github.com/King5upah/story-slides-swift)),
since both use the same JSON shape.

```tsx
import { downloadShareableDeck, fromShareableJSON } from "story-slides";

downloadShareableDeck({ name: "Vocabulario A1", cards });

const deck = fromShareableJSON(jsonText); // { name, cards }
```

## Demo

```bash
git clone https://github.com/King5upah/story-slides.git
cd story-slides && npm install
cd demo && npm install && npm run dev
```

## License

MIT
