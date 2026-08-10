import { useState, type FormEvent } from "react";
import type { CardWidget, BarajaCard, CardDeckProps, DeckResult } from "./types";
import { tapBehaviorFor, isGraded } from "./types";
import styles from "./StoryDeck.module.css";

function ChoiceWidget({
  question,
  options,
  correctIndices,
  isMulti,
  explanation,
  accentColor,
  resolved,
  onResolved,
}: {
  question: string;
  options: string[];
  correctIndices: number[];
  isMulti: boolean;
  explanation?: string;
  accentColor: string;
  resolved: boolean;
  onResolved: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  function select(i: number) {
    if (resolved) return;
    if (isMulti) {
      const next = new Set(selected);
      next.has(i) ? next.delete(i) : next.add(i);
      setSelected(next);
    } else {
      setSelected(new Set([i]));
      onResolved(correctIndices.length === 1 && correctIndices[0] === i);
    }
  }

  function submit() {
    if (selected.size === 0) return;
    const correct =
      selected.size === correctIndices.length && [...selected].every((i) => correctIndices.includes(i));
    onResolved(correct);
  }

  return (
    <div className={`${styles.slideFull} ${styles.autoPointer}`}>
      <p style={{ fontWeight: 700, fontSize: 22, color: "white", textAlign: "center", lineHeight: 1.4 }}>
        {question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt, i) => {
          let bg = selected.has(i) ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)";
          let color = "white";
          if (resolved) {
            if (correctIndices.includes(i)) bg = "rgba(74,124,89,0.35)";
            else if (selected.has(i)) bg = "rgba(125,32,51,0.35)";
            else bg = "rgba(255,255,255,0.04)";
          }
          return (
            <button
              key={i}
              disabled={resolved}
              onClick={() => select(i)}
              className={styles.optionButton}
              style={{ background: bg, border: "none", color }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {isMulti && !resolved && (
        <button
          onClick={submit}
          disabled={selected.size === 0}
          className={styles.checkButton}
          style={{ background: accentColor, opacity: selected.size === 0 ? 0.4 : 1 }}
        >
          Comprobar
        </button>
      )}
      {resolved && explanation && (
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>{explanation}</p>
      )}
    </div>
  );
}

function FillInBlankWidget({
  prompt,
  answer,
  hint,
  resolved,
  onResolved,
}: {
  prompt: string;
  answer: string;
  hint?: string;
  resolved: boolean;
  onResolved: (correct: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const isCorrect = input.trim().toLowerCase() === answer.trim().toLowerCase();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onResolved(isCorrect);
  }

  return (
    <div className={`${styles.slideFull} ${styles.autoPointer}`}>
      <p style={{ fontWeight: 700, fontSize: 22, color: "white", textAlign: "center", lineHeight: 1.4 }}>
        {prompt}
      </p>
      {resolved ? (
        <p style={{ fontSize: 17, fontWeight: 700, textAlign: "center", color: isCorrect ? "#4a7c59" : "#c14b5f" }}>
          {isCorrect ? "¡Correcto!" : `Era: ${answer}`}
        </p>
      ) : (
        <form onSubmit={submit}>
          <input
            autoFocus
            className={styles.fillInput}
            placeholder="Escribe tu respuesta"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {hint && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 8 }}>
              Pista: {hint}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

function CardWidgetView({
  prompt,
  widget,
  accentColor,
  resolved,
  onResolved,
}: {
  prompt?: string;
  widget: CardWidget;
  accentColor: string;
  resolved: boolean;
  onResolved: (correct: boolean | null) => void;
}) {
  const behavior = tapBehaviorFor(widget);
  const showHint = behavior === "advanceImmediately" || resolved;

  return (
    <div className={styles.slideFull}>
      {prompt && (
        <p className={styles.eyebrow} style={{ color: accentColor }}>
          {prompt}
        </p>
      )}

      {widget.type === "flipCard" && (
        <div className={`${styles.slideCentered}`} style={{ height: "auto" }}>
          <p style={{ fontSize: 34, fontWeight: 800, color: "white", textAlign: "center", margin: 0 }}>
            {resolved ? widget.back.split("\n\n")[0] : widget.front}
          </p>
          {resolved && widget.back.split("\n\n")[1] && (
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
              {widget.back.split("\n\n")[1]}
            </p>
          )}
          {!resolved && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Toca para ver la traducción</p>
          )}
        </div>
      )}

      {(widget.type === "singleChoiceQuiz" || widget.type === "multiChoiceQuiz") && (
        <ChoiceWidget
          question={widget.question}
          options={widget.options}
          correctIndices={widget.type === "singleChoiceQuiz" ? [widget.correctIndex] : widget.correctIndices}
          isMulti={widget.type === "multiChoiceQuiz"}
          explanation={widget.explanation}
          accentColor={accentColor}
          resolved={resolved}
          onResolved={(correct) => onResolved(correct)}
        />
      )}

      {widget.type === "trueFalse" && (
        <ChoiceWidget
          question={widget.statement}
          options={["Verdadero", "Falso"]}
          correctIndices={[widget.isTrue ? 0 : 1]}
          isMulti={false}
          explanation={widget.explanation}
          accentColor={accentColor}
          resolved={resolved}
          onResolved={(correct) => onResolved(correct)}
        />
      )}

      {widget.type === "fillInBlank" && (
        <FillInBlankWidget
          prompt={widget.prompt}
          answer={widget.answer}
          hint={widget.hint}
          resolved={resolved}
          onResolved={(correct) => onResolved(correct)}
        />
      )}

      {(widget.type === "counter" || widget.type === "rating") && (
        <div className={styles.slideCentered} style={{ height: "auto" }}>
          <p className={styles.eyebrow} style={{ color: accentColor }}>
            {widget.label}
          </p>
          <p className={styles.statValue}>
            {widget.type === "counter"
              ? widget.total != null
                ? `${widget.value}/${widget.total}`
                : `${widget.value}`
              : "★".repeat(widget.value) + "☆".repeat(Math.max(0, widget.maxValue - widget.value))}
          </p>
        </div>
      )}

      {showHint && <p className={styles.continueHint}>Toca para continuar</p>}
    </div>
  );
}

function DeckResultView({
  result,
  accentColor,
  onClose,
}: {
  result: DeckResult;
  accentColor: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.resultRoot}>
      <div />
      <div>
        <p style={{ fontSize: 48 }}>🎉</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", margin: "8px 0" }}>¡Mazo terminado!</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)" }}>
          {result.graded > 0 ? `${result.correct}/${result.graded} correctas` : `${result.total} tarjetas revisadas`}
        </p>
      </div>
      <button onClick={onClose} className={styles.ctaButton} style={{ background: accentColor, width: "80%" }}>
        Cerrar
      </button>
    </div>
  );
}

/// Runs a deck of `BarajaCard`s using the exact same interaction language
/// as `StoryDeck`: tap left/right to go back or advance. Graded widgets
/// answer through their own controls; everything else — including
/// revealing a flip card's back — advances through the shared tap zones.
export function CardDeck({ cards, accentColor = "#7d2033", title, icon, onExit, onFinish }: CardDeckProps) {
  const [index, setIndex] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [graded, setGraded] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = cards[index];

  function resolve(isCorrect: boolean | null) {
    if (resolved) return;
    setResolved(true);
    if (isCorrect !== null) {
      setGraded((g) => g + 1);
      if (isCorrect) setCorrect((c) => c + 1);
    }
  }

  function advance() {
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
      setResolved(false);
    } else {
      setFinished(true);
    }
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setResolved(false);
  }

  function handleRightTap() {
    if (!current) return;
    if (resolved) {
      advance();
      return;
    }
    const behavior = tapBehaviorFor(current.widget);
    if (behavior === "advanceImmediately") {
      resolve(null);
      advance();
    } else if (behavior === "revealThenAdvance") {
      setResolved(true);
    }
    // "requiresInteraction": no-op, the widget's own controls call resolve()
  }

  const result: DeckResult = { total: cards.length, graded, correct };

  if (finished) {
    return (
      <div className={styles.root}>
        <div className={styles.deck} style={{ background: "#1c2b4b" }}>
          <DeckResultView
            result={result}
            accentColor={accentColor}
            onClose={() => {
              onFinish?.(result);
              onExit?.();
            }}
          />
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className={styles.root}>
      <div className={styles.deck} style={{ background: "#1c2b4b" }}>
        <div className={styles.progressRow}>
          {cards.map((_, i) => (
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
          <CardWidgetView
            key={current.id ?? index}
            prompt={current.prompt}
            widget={current.widget}
            accentColor={accentColor}
            resolved={resolved}
            onResolved={resolve}
          />
        </div>

        <div className={styles.tapZones}>
          <button aria-label="previous" onClick={goPrev} className={styles.tapZone} />
          <button aria-label="next" onClick={handleRightTap} className={styles.tapZone} />
        </div>
      </div>
    </div>
  );
}
