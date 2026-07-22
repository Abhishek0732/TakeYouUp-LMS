import { useEffect, useState } from "react";

interface CourseCoverProps {
  /** Host-relative URL from the API (/uploads/courses/…) or an absolute URL. */
  src?: string | null;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PALETTE = ["#ff4d1c", "#f89820", "#4b8bbe", "#38bdf8", "#a855f7", "#22c55e"];

/** Stable colour per course so a card does not change hue between renders. */
function hue(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

/**
 * Course cover image with a graceful placeholder — used when a course has no
 * uploaded cover yet, or when the file 404s (e.g. removed from the volume).
 */
const CourseCover = ({ src, title = "", className, style }: CourseCoverProps) => {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt, otherwise one bad URL poisons the slot.
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    const color = hue(title);
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${color}, ${color}44)`,
          color: "rgba(255,255,255,0.55)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "2rem",
          fontWeight: 500,
        }}
        role="img"
        aria-label={title}
      >
        {"</>"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
};

export default CourseCover;
