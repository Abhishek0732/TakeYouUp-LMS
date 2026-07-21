/**
 * Loads the highlight.js grammars on demand.
 *
 * Most pages (home, courses list, profile…) never show a code block, so the
 * grammar chunk is fetched only when the first <CodeBlock /> mounts. Until it
 * resolves the block renders as escaped plain text, then re-renders highlighted
 * — no layout shift, no blocking the initial bundle.
 */
type HighlightModule = typeof import("@/lib/highlight");

let loaded: HighlightModule | null = null;
let pending: Promise<HighlightModule> | null = null;

/** The module if it is already in memory, otherwise null (render plain first). */
export function highlighterIfLoaded(): HighlightModule | null {
  return loaded;
}

/** Fetch the grammars once and share the promise across every code block. */
export function loadHighlighter(): Promise<HighlightModule> {
  if (loaded) return Promise.resolve(loaded);
  if (!pending) {
    pending = import("@/lib/highlight").then((mod) => {
      loaded = mod;
      return mod;
    });
  }
  return pending;
}
