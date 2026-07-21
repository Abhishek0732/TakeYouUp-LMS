import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { escapeHtml, languageLabel } from "@/lib/code-languages";
import { highlighterIfLoaded, loadHighlighter } from "@/lib/highlight-loader";

interface CodeBlockProps {
  code: string;
  language?: string;
  /** Optional caption shown in the header instead of the language label. */
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * Read-only syntax-highlighted code block with a copy button and line gutter.
 * Highlighting happens once per (code, language) pair via useMemo, so long
 * lessons with many snippets stay cheap to re-render.
 */
const CodeBlock = ({ code, language, filename, showLineNumbers = true, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const body = (code ?? "").replace(/\s+$/, "");

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
        <button type="button" onClick={copy} className="tyu-code__copy" title="Copy code">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
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
    </div>
  );
};

export default CodeBlock;
