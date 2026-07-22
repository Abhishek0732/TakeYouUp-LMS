import React, { useMemo } from "react";
import CodeBlock from "@/components/CodeBlock";

/**
 * Minimal, dependency-free Markdown renderer for lesson bodies and question
 * text. Deliberately small — it covers exactly what course authors need:
 *
 *   ```java … ```      fenced code block (syntax highlighted, copyable)
 *   # / ## / ### …     headings
 *   - item  /  1. item lists
 *   > quote            blockquote
 *   ---                divider
 *   **bold**  *italic*  `inline code`  [link](url)
 *
 * Everything is rendered as React nodes (never dangerouslySetInnerHTML) except
 * the code blocks, which go through highlight.js and are escaped there — so
 * author-supplied HTML can't execute.
 */

interface RichContentProps {
  text?: string | null;
  className?: string;
  /** Tighter spacing for inline contexts like key-point explanations. */
  compact?: boolean;
}

type Block =
  | { kind: "code"; language: string; code: string; runnable: boolean }
  | { kind: "prose"; text: string };

// Captures the info string after the fence, e.g. ```java  or  ```java norun.
// Plenty of snippets are fragments with no entry point, or deliberate
// illustrations of something broken; `norun` lets an author suppress the Run
// button on those rather than offering one that always fails.
const FENCE = /```([a-zA-Z0-9+#._-]*)([^\n]*)\r?\n?([\s\S]*?)```/g;

function splitFences(src: string): Block[] {
  const blocks: Block[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  FENCE.lastIndex = 0;
  while ((match = FENCE.exec(src)) !== null) {
    if (match.index > last) blocks.push({ kind: "prose", text: src.slice(last, match.index) });
    const info = (match[2] || "").trim().toLowerCase();
    blocks.push({
      kind: "code",
      language: (match[1] || "plaintext").toLowerCase(),
      code: match[3] || "",
      runnable: !/\bnorun\b/.test(info),
    });
    last = match.index + match[0].length;
  }
  if (last < src.length) blocks.push({ kind: "prose", text: src.slice(last) });
  return blocks;
}

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;

/** Parse bold / italic / inline-code / links inside a single run of text. */
function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    const key = `${keyPrefix}-i${i++}`;
    if (token.startsWith("`")) {
      nodes.push(<code key={key} className="tyu-inline-code">{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const split = token.indexOf("](");
      const label = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        <a key={key} href={href} className="tyu-link"
          target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined}>
          {label}
        </a>
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Turn a run of plain Markdown (no fences) into block-level React nodes. */
function renderProse(src: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const lines = src.split(/\r?\n/);
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];
  let n = 0;

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join("\n").trim();
    para = [];
    if (text) out.push(<p key={`${keyPrefix}-p${n++}`} className="tyu-p">{inline(text, `${keyPrefix}-p${n}`)}</p>);
  };
  const flushList = () => {
    if (!list) return;
    const { ordered, items } = list;
    list = null;
    const children = items.map((it, idx) => (
      <li key={idx} className="tyu-li">{inline(it, `${keyPrefix}-l${n}-${idx}`)}</li>
    ));
    out.push(ordered
      ? <ol key={`${keyPrefix}-ol${n++}`} className="tyu-ol">{children}</ol>
      : <ul key={`${keyPrefix}-ul${n++}`} className="tyu-ul">{children}</ul>);
  };
  const flushQuote = () => {
    if (!quote.length) return;
    const text = quote.join("\n");
    quote = [];
    out.push(<blockquote key={`${keyPrefix}-q${n++}`} className="tyu-quote">{inline(text, `${keyPrefix}-q${n}`)}</blockquote>);
  };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");

    if (!line.trim()) { flushAll(); continue; }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const Tag = (`h${Math.min(level + 1, 6)}`) as keyof JSX.IntrinsicElements;
      out.push(<Tag key={`${keyPrefix}-h${n++}`} className={`tyu-h tyu-h${level}`}>{inline(heading[2], `${keyPrefix}-h${n}`)}</Tag>);
      continue;
    }

    if (/^(---|\*\*\*|___)\s*$/.test(line)) { flushAll(); out.push(<hr key={`${keyPrefix}-hr${n++}`} className="tyu-hr" />); continue; }

    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      flushPara(); flushQuote();
      if (!list || list.ordered) { flushList(); list = { ordered: false, items: [] }; }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (numbered) {
      flushPara(); flushQuote();
      if (!list || !list.ordered) { flushList(); list = { ordered: true, items: [] }; }
      list.items.push(numbered[1]);
      continue;
    }

    const q = /^>\s?(.*)$/.exec(line);
    if (q) { flushPara(); flushList(); quote.push(q[1]); continue; }

    flushList(); flushQuote();
    para.push(line);
  }
  flushAll();
  return out;
}

/**
 * Inline-only variant — bold/italic/`code`/links, no block elements. Use where
 * the surrounding layout already provides the container (buttons, headings).
 */
export const InlineMarkdown = ({ text, className }: { text?: string | null; className?: string }) => {
  const nodes = useMemo(() => (text ? inline(text, "inl") : []), [text]);
  if (!text) return null;
  return <span className={className}>{nodes}</span>;
};

const RichContent = ({ text, className, compact }: RichContentProps) => {
  const blocks = useMemo(() => splitFences(text || ""), [text]);

  if (!text || !text.trim()) return null;

  return (
    <div className={`tyu-rich ${compact ? "tyu-rich--compact" : ""} ${className || ""}`}>
      {blocks.map((b, i) =>
        b.kind === "code"
          ? <CodeBlock key={`c${i}`} code={b.code} language={b.language} runnable={b.runnable} />
          : <React.Fragment key={`t${i}`}>{renderProse(b.text, `b${i}`)}</React.Fragment>
      )}
    </div>
  );
};

export default RichContent;
