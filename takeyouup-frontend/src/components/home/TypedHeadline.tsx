import { useEffect, useState } from "react";

export const LINES = ["Code.", "Compile.", "Succeed."];

/** Per-character speed, and the beat between finishing one line and starting the next. */
const CHAR_MS = 70;
const LINE_PAUSE_MS = 260;
/** Let the hero's fade-up settle before the first character lands. */
const START_DELAY_MS = 400;

const TOTAL_CHARS = LINES.reduce((n, l) => n + l.length, 0);

/** Character index at which each line starts, e.g. [0, 5, 13]. */
const LINE_STARTS = LINES.reduce<number[]>((acc, line, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LINES[i - 1].length);
  return acc;
}, []);

/** Counts at which a line has just been completed — where we pause. */
const LINE_ENDS = new Set(LINE_STARTS.slice(1).concat(TOTAL_CHARS));

/**
 * How much of each line is visible once `count` characters have been typed.
 * Pure, so the render is a function of one number and nothing can drift.
 */
export function slicesFor(count: number): string[] {
  return LINES.map((line, i) => {
    const typed = Math.min(Math.max(count - LINE_STARTS[i], 0), line.length);
    return line.slice(0, typed);
  });
}

/**
 * Each line split into the part typed so far and the part still to come.
 *
 * Both halves are rendered; the pending half is only made invisible. That
 * matters for search engines: this component is the page's h1, and when it
 * rendered just the typed prefix, the h1's indexable text was incomplete for
 * the ~2.5s the animation takes. A crawler snapshotting the page early indexed
 * the homepage heading as "Code. Co". Keeping the full string in the DOM means
 * the text content is correct from the very first frame, and it also stops each
 * line's width from growing as characters land.
 */
export function splitFor(count: number): { shown: string; pending: string }[] {
  return LINES.map((line, i) => {
    const typed = Math.min(Math.max(count - LINE_STARTS[i], 0), line.length);
    return { shown: line.slice(0, typed), pending: line.slice(typed) };
  });
}

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
 * State is a single character count and the lines are derived from it. The
 * previous version tracked a mutable line/char pair and mutated them straight
 * after calling the state updater — React runs that updater later, by which
 * point both had already moved on, so the character that completed each line
 * was written to the wrong slot. Every line rendered one character short, which
 * is why the full stops disappeared. A derived count cannot drift like that.
 *
 * Every line keeps its box whether or not it has been typed, so the hero never
 * reflows as characters arrive.
 *
 * The animation is decorative: the real text is on the <h1> as an aria-label
 * and these spans are hidden from assistive tech, so a screen reader announces
 * the headline once rather than on every keystroke.
 */
const TypedHeadline = () => {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? TOTAL_CHARS : 0));

  useEffect(() => {
    if (count >= TOTAL_CHARS) return;

    const delay =
      count === 0 ? START_DELAY_MS : LINE_ENDS.has(count) ? LINE_PAUSE_MS : CHAR_MS;

    const timer = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(timer);
  }, [count]);

  const parts = splitFor(count);

  return (
    <span aria-hidden="true">
      {parts.map(({ shown, pending }, i) => (
        <span
          key={LINES[i]}
          style={{
            display: "block",
            // Reserve the full line box up front — this is what stops the page
            // jumping as each line appears.
            minHeight: "1.04em",
            whiteSpace: "pre",
          }}
        >
          <span style={i === LINES.length - 1 ? GRADIENT : undefined}>{shown}</span>
          {/* Still in the DOM, just not painted — see splitFor(). visibility
              keeps it out of the accessibility tree too, so a screen reader
              still gets only the h1's aria-label. */}
          <span style={{ visibility: "hidden" }}>{pending}</span>
        </span>
      ))}
    </span>
  );
};

export default TypedHeadline;
