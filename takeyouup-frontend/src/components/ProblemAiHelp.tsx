import { useState, type CSSProperties } from "react";
import { Lightbulb, BookOpen, Loader2 } from "lucide-react";
import RichContent from "@/components/RichContent";
import { fetchHint, fetchSolution } from "@/api/ai";

type Kind = "hint" | "solution";

/**
 * The expandable AI panel for one practice problem. Mounted by the row only
 * when its "AI help" trigger is toggled on, so it renders inline beneath the
 * row content spanning the full card width.
 *
 * "Get a hint" returns concepts and progressive hints (no full solution);
 * "Show solution" returns the complete worked answer. Both are Markdown,
 * rendered by <RichContent /> (fenced code blocks included), and cached per
 * kind so switching back and forth never re-calls the model.
 */
export default function ProblemAiHelp({ questionId }: { questionId: number }) {
  const [loading, setLoading] = useState<Kind | null>(null);
  const [active, setActive] = useState<Kind | null>(null);
  const [cache, setCache] = useState<Partial<Record<Kind, string>>>({});
  const [error, setError] = useState<string | null>(null);

  const run = async (kind: Kind) => {
    setError(null);
    setActive(kind);
    if (cache[kind] !== undefined) return; // already fetched — just show it
    setLoading(kind);
    try {
      const content = kind === "hint" ? await fetchHint(questionId) : await fetchSolution(questionId);
      setCache((c) => ({ ...c, [kind]: content }));
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Couldn't reach the AI helper. Please try again.";
      setError(msg);
      setActive(null);
    } finally {
      setLoading(null);
    }
  };

  const btnBase: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600,
    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
    border: "1px solid hsl(var(--border))", background: "hsl(var(--card))",
    color: "hsl(var(--foreground))", transition: "all 0.15s",
  };
  const btn = (kind: Kind): CSSProperties =>
    active === kind
      ? { ...btnBase, background: "linear-gradient(135deg, #ff4d1c, #ffb800)", color: "#fff", borderColor: "transparent" }
      : btnBase;

  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed hsl(var(--border))" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button style={btn("hint")} onClick={() => run("hint")} disabled={loading !== null}>
          {loading === "hint" ? <Loader2 className="animate-spin" style={{ width: 13, height: 13 }} /> : <Lightbulb style={{ width: 13, height: 13 }} />}
          Get a hint
        </button>
        <button style={btn("solution")} onClick={() => run("solution")} disabled={loading !== null}>
          {loading === "solution" ? <Loader2 className="animate-spin" style={{ width: 13, height: 13 }} /> : <BookOpen style={{ width: 13, height: 13 }} />}
          Show solution
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 10, fontSize: 12.5, color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }} aria-live="polite">
          {error}
        </p>
      )}

      {active && cache[active] !== undefined && (
        <div
          style={{ marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}
          aria-live="polite"
        >
          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
            {active === "hint" ? "Hint" : "Solution"} · AI-generated
          </div>
          <RichContent text={cache[active]} compact />
        </div>
      )}

      {loading && cache[loading] === undefined && (
        <p style={{ marginTop: 12, fontSize: 12.5, color: "hsl(var(--muted-foreground))", fontFamily: "'DM Sans', sans-serif" }} aria-live="polite">
          Thinking…
        </p>
      )}
    </div>
  );
}
