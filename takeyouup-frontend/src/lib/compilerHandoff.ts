const KEY = "compilerHandoff";

/**
 * How long a stashed snippet stays valid.
 *
 * The handoff is written immediately before opening the compiler, so it only
 * ever needs to survive a page load. The window exists so a stash that never
 * got picked up — popup blocked, tab closed before it painted — cannot surface
 * days later and overwrite whatever the learner has typed.
 */
const MAX_AGE_MS = 30_000;

export type CompilerHandoff = { language: string; code: string };

type Stored = CompilerHandoff & { at: number };

/**
 * Carries a lesson snippet over to the compiler page.
 *
 * localStorage, not sessionStorage: the compiler opens in a NEW TAB, and a tab
 * opened with `noopener` starts with an empty sessionStorage, so nothing would
 * arrive. localStorage is shared across tabs of the same origin, which is
 * exactly the channel needed here.
 *
 * Not a query parameter, for three reasons: URLs have a practical length limit
 * a real snippet can exceed, encoding code through a query string is fiddly to
 * get right, and a shareable link carrying somebody's code is a small footgun.
 *
 * Read-once and time-boxed — see MAX_AGE_MS.
 */
export function stashHandoff(handoff: CompilerHandoff): void {
  try {
    const payload: Stored = { ...handoff, at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Private browsing or a full quota — the compiler opens with its default
    // sample instead, which is worse but not broken.
  }
}

export function consumeHandoff(): CompilerHandoff | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    // Cleared before validation so a malformed or stale entry cannot wedge
    // itself and be retried on every future visit.
    localStorage.removeItem(KEY);

    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.code !== "string" || typeof parsed?.language !== "string") return null;
    if (typeof parsed.at !== "number" || Date.now() - parsed.at > MAX_AGE_MS) return null;

    return { language: parsed.language, code: parsed.code };
  } catch {
    return null;
  }
}
