import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Loader2, Play } from "lucide-react";
import { escapeHtml, languageLabel } from "@/lib/code-languages";
import { highlighterIfLoaded, loadHighlighter } from "@/lib/highlight-loader";
import { runCode, type ExecuteResult } from "@/api/execute";
import useRunnableLanguages from "@/hooks/useRunnableLanguages";
import { stashHandoff } from "@/lib/compilerHandoff";

interface CodeBlockProps {
  code: string;
  language?: string;
  /** Optional caption shown in the header instead of the language label. */
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
  /**
   * Whether a Run button may be offered. False for a fence marked `norun` —
   * fragments with no entry point, or code that is deliberately broken.
   * A runnable language is still required on top of this.
   */
  runnable?: boolean;
}

/**
 * Read-only syntax-highlighted code block with a copy button and line gutter.
 * Highlighting happens once per (code, language) pair via useMemo, so long
 * lessons with many snippets stay cheap to re-render.
 */
const CodeBlock = ({ code, language, filename, showLineNumbers = true, className, runnable = true }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const body = (code ?? "").replace(/\s+$/, "");

  // Output appears beneath the snippet rather than in a new tab: the learner is
  // mid-lesson, and sending them elsewhere costs them their place — on mobile
  // they often do not come back. "Open in compiler" stays available for the
  // different intent of wanting to edit and experiment.
  const runnableLanguages = useRunnableLanguages();
  const canRun = runnable && !!language && runnableLanguages.has(language.toLowerCase());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecuteResult | null>(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      setResult(await runCode(language!, body));
    } catch (e: any) {
      setResult({
        output: e?.response?.status === 429
          ? "You are running code very quickly. Give it a moment and try again."
          : "Could not reach the code runner. Please try again.",
        status: "Error", ok: false, timeMs: null, cached: false,
      });
    } finally {
      setRunning(false);
    }
  };

  const openInCompiler = () => {
    stashHandoff({ language: language!.toLowerCase(), code: body });
    window.open("/online-compiler", "_blank", "noopener");
  };

  // Grammars arrive in a lazy chunk; until then show escaped plain text.
  const [hl, setHl] = useState(highlighterIfLoaded);
  useEffect(() => {
    if (hl) return;
    let alive = true;
    loadHighlighter().then((mod) => { if (alive) setHl(() => mod); });
    return () => { alive = false; };
  }, [hl]);

  const html = useMemo(
    () => (hl ? hl.highlightCode(body, language) : escapeHtml(body)),
    [body, language, hl]
  );
  const lineCount = useMemo(() => body.split("\n").length, [body]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      // clipboard blocked (insecure origin) — fall back to a temporary textarea
      const ta = document.createElement("textarea");
      ta.value = body;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`tyu-code ${className || ""}`}>
      <div className="tyu-code__bar">
        <span className="tyu-code__lang">{filename || languageLabel(language)}</span>
        <span className="tyu-code__actions">
          {canRun && (
            <>
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="tyu-code__copy"
                title="Run this snippet"
                aria-label="Run this snippet"
              >
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {running ? "Running" : "Run"}
              </button>
              <button
                type="button"
                onClick={openInCompiler}
                className="tyu-code__copy"
                title="Open in the compiler to edit"
                aria-label="Open this snippet in the compiler"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button type="button" onClick={copy} className="tyu-code__copy" title="Copy code" aria-label="Copy code">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </span>
      </div>
      <div className="tyu-code__body">
        {showLineNumbers && lineCount > 1 && (
          <div className="tyu-code__gutter" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        )}
        {/* `html` comes from highlight.js, which escapes the input it tokenises. */}
        <pre className="tyu-code__pre">
          <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>

      {result && (
        <div className="tyu-code__output" role="status" aria-live="polite">
          <div className="tyu-code__output-bar">
            <span className={result.ok ? "tyu-code__ok" : "tyu-code__fail"}>
              {result.status}
            </span>
            <span className="tyu-code__meta">
              {result.cached ? "cached" : result.timeMs != null ? `${result.timeMs} ms` : ""}
            </span>
          </div>
          <pre className="tyu-code__output-body">{result.output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
