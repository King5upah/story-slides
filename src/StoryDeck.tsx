import { useState } from "react";
import type { StorySlide, StoryDeckProps } from "./types";
import styles from "./StoryDeck.module.css";

// A quiz slide follows the same convention as every other tap-to-advance
// slide: selecting an option locks the answer immediately (no "Comprobar"
// button) and the deck's own tap zones — not an in-slide button — advance
// to the next slide once it's answered.
function QuizSlide({
  slide,
  onAnswered,
}: {
  slide: Extract<StorySlide, { type: "quiz" }>;
  onAnswered: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const checked = selected !== null;
  const isCorrect = selected === slide.correct;

  function select(i: number) {
    if (checked) return;
    setSelected(i);
    onAnswered();
  }

  return (
    <div className={`${styles.slideFull} ${styles.autoPointer}`}>
      <p style={{ fontWeight: 700, fontSize: 20, color: "white", textAlign: "center", lineHeight: 1.4 }}>
        {slide.question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {slide.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.08)",
            border = "rgba(255,255,255,0.25)",
            color = "white";
          if (checked) {
            if (i === slide.correct) {
              bg = "#e8f5ee";
              border = "#4a7c59";
              color = "#2d6a4f";
            } else if (i === selected) {
              bg = "#fde8ec";
              border = "#7d2033";
              color = "#7d2033";
            }
          }
          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => select(i)}
              className={styles.optionButton}
              style={{ background: bg, border: `2px solid ${border}`, color }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {checked && (
        <>
          <div style={{ borderRadius: 12, padding: 16, background: isCorrect ? "#e8f5ee" : "#fde8ec" }}>
            <p style={{ fontWeight: 700, marginBottom: 4, color: isCorrect ? "#2d6a4f" : "#7d2033", fontSize: 14 }}>
              {isCorrect ? "✓" : "✗"}
            </p>
            <p style={{ fontSize: 14, color: "#3d2b1f" }}>{slide.explanation}</p>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Toca para continuar</p>
        </>
      )}
    </div>
  );
}

function SlideView({
  slide,
  accentColor,
  onQuizAnswered,
  onComplete,
}: {
  slide: StorySlide;
  accentColor: string;
  onQuizAnswered: () => void;
  onComplete?: () => void;
}) {
  switch (slide.type) {
    case "title":
      return (
        <div className={styles.slideCentered}>
          {slide.icon && <span style={{ fontSize: 56 }}>{slide.icon}</span>}
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "white", margin: 0 }}>{slide.heading}</h1>
          {slide.subheading && <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{slide.subheading}</p>}
        </div>
      );

    case "text":
      return (
        <div className={styles.slideFull}>
          {slide.heading && (
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", color: accentColor }}>
              {slide.heading}
            </p>
          )}
          <p style={{ fontSize: 22, textAlign: "center", color: "white", lineHeight: 1.5 }}>{slide.body}</p>
        </div>
      );

    case "highlight":
      return (
        <div className={styles.slideCentered}>
          <div style={{ borderRadius: 12, padding: "16px 20px", background: "white", color: "#1c2b4b", fontWeight: 700, fontSize: 17, textAlign: "center" }}>
            {slide.content}
          </div>
          {slide.caption && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{slide.caption}</p>}
        </div>
      );

    case "example":
      return (
        <div className={styles.slideCentered}>
          <p style={{ fontSize: 26, fontWeight: 700, fontStyle: "italic", color: "white", margin: 0 }}>{slide.text}</p>
          {slide.note && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{slide.note}</p>}
        </div>
      );

    case "table":
      return (
        <div className={styles.slideFull} style={{ gap: 12 }}>
          {slide.caption && (
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", color: accentColor }}>
              {slide.caption}
            </p>
          )}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {slide.headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ fontWeight: j === 0 ? 600 : 400 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "tip":
      return (
        <div className={styles.slideCentered}>
          <div style={{ borderRadius: 12, padding: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, color: accentColor }}>
              Tip
            </p>
            <p style={{ fontSize: 15, color: "white", lineHeight: 1.5, margin: 0 }}>{slide.body}</p>
          </div>
        </div>
      );

    case "quiz":
      return <QuizSlide slide={slide} onAnswered={onQuizAnswered} />;

    case "cta":
      return (
        <div className={`${styles.slideCentered} ${styles.autoPointer}`}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", margin: 0 }}>{slide.heading}</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{slide.body}</p>
          <button onClick={onComplete} className={styles.ctaButton} style={{ background: accentColor }}>
            {slide.label}
          </button>
        </div>
      );

    default:
      return null;
  }
}

export function StoryDeck({ slides, accentColor = "#7d2033", title, icon, onExit, onComplete }: StoryDeckProps) {
  const [index, setIndex] = useState(0);
  const [quizLocked, setQuizLocked] = useState(slides[0]?.type === "quiz");

  const current = slides[index];
  const isQuiz = current?.type === "quiz";
  const isLast = index === slides.length - 1;
  const canAdvance = !isQuiz || !quizLocked;

  function goNext() {
    if (!canAdvance || isLast) return;
    const next = index + 1;
    setIndex(next);
    setQuizLocked(slides[next]?.type === "quiz");
  }

  function goPrev() {
    if (index === 0) return;
    const prev = index - 1;
    setIndex(prev);
    setQuizLocked(slides[prev]?.type === "quiz");
  }

  if (!current) return null;

  return (
    <div className={styles.root}>
      <div className={styles.deck} style={{ background: "#1c2b4b" }}>
        <div className={styles.progressRow}>
          {slides.map((_, i) => (
            <div key={i} className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: i <= index ? "100%" : "0%", background: accentColor }}
              />
            </div>
          ))}
        </div>

        <div className={styles.header}>
          {icon && <span>{icon}</span>}
          {title && <span className={styles.headerTitle}>{title}</span>}
          {onExit && (
            <button onClick={onExit} className={styles.exitButton} aria-label="close">
              ✕
            </button>
          )}
        </div>

        <div className={styles.content}>
          <SlideView slide={current} accentColor={accentColor} onQuizAnswered={() => setQuizLocked(false)} onComplete={onComplete} />
        </div>

        {current.type !== "cta" && (
          <div className={styles.tapZones}>
            <button aria-label="previous" onClick={goPrev} className={styles.tapZone} />
            <button aria-label="next" onClick={goNext} disabled={!canAdvance} className={styles.tapZone} />
          </div>
        )}
      </div>
    </div>
  );
}
