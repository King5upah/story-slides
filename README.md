# story-slides

Tap-to-advance story slides for structured content — an Instagram-Stories-like UX for React, with embedded quizzes and no autoplay timers.

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

## Demo

```bash
git clone https://github.com/King5upah/story-slides.git
cd story-slides && npm install
cd demo && npm install && npm run dev
```

## License

MIT
