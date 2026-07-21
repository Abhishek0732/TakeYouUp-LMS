import { useEffect, useState } from "react";

const LINES = ["Code.", "Compile.", "Succeed."];

/** Per-character speed, and the beat between finishing one line and starting the next. */
const CHAR_MS = 70;
const LINE_PAUSE_MS = 260;
/** Let the hero's fade-up settle before the first character lands. */
const START_DELAY_MS = 400;

const GRADIENT: React.CSSProperties = {
  background: "linear-gradient(135deg, #ff4d1c 0%, #ffb800 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Types out "Code. Compile. Succeed." on load, full stops included.
 *
 * Every line keeps its box whether or not it has been typed yet, so the hero
 * never reflows as characters arrive — a headline that grows line by line would
 * shove the sub-heading, CTAs and stats down the page three times on every
 * visit.
 *
 * The animation is decorative: the real text is on the <h1> as an aria-label,
 * and these spans are hidden from assistive tech so a screen reader announces
 * the headline once instead of on every keystroke.
 */
const TypedHeadline = () => {
  // Characters revealed on each line. Starts complete when the OS asks for
  // reduced motion, so the effect is skipped rather than merely sped up.
  const [typed, setTyped] = useState<number[]>(() =>
    prefersReducedMotion() ? LINES.map((l) => l.length) : LINES.map(() => 0)
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let line = 0;
    let char = 0;
    let timer: number;

    const step = () => {
      if (line >= LINES.length) return;   // every line fully typed

      char++;
      setTyped((prev) => {
        const next = [...prev];
        next[line] = char;
        return next;
      });

      const finishedLine = char >= LINES[line].length;
      if (finishedLine) {
        line++;
        char = 0;
      }
      timer = window.setTimeout(step, finishedLine ? LINE_PAUSE_MS : CHAR_MS);
    };

    timer = window.setTimeout(step, START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <span aria-hidden="true">
      {LINES.map((line, i) => (
        <span
          key={line}
          style={{
            display: "block",
            // Reserve the full line box up front — this is what stops the page
            // jumping as each line appears.
            minHeight: "1.04em",
            whiteSpace: "pre",
          }}
        >
          <span style={i === LINES.length - 1 ? GRADIENT : undefined}>
            {line.slice(0, typed[i])}
          </span>
        </span>
      ))}
    </span>
  );
};

export default TypedHeadline;
