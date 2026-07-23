import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Code2, Eye, ImagePlus, Loader2, Pencil } from "lucide-react";
import RichContent from "@/components/RichContent";
import { CODE_LANGUAGES } from "@/lib/code-languages";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  /** Shown under the toolbar as a one-line cheat sheet. */
  hint?: string;
  /**
   * When provided, an "Insert image" button appears: it uploads the chosen file
   * and drops an `![](url)` at the cursor. Left out (the course editors), no
   * button shows and nothing about those editors changes.
   */
  onUploadImage?: (file: File) => Promise<string>;
}

const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };

/**
 * Textarea + "insert code block" toolbar + live preview. Content is stored as
 * plain Markdown, so what the author writes here is exactly what
 * <RichContent /> renders on the learner-facing page.
 */
export default function MarkdownEditor({ value, onChange, rows = 12, placeholder, hint, onUploadImage }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState("java");
  const [preview, setPreview] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  /** Upload the chosen image and drop `![](url)` on its own line at the caret. */
  const onImageChosen = async (file: File) => {
    if (!onUploadImage) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    setUploadingImg(true);
    try {
      const url = await onUploadImage(file);
      const el = ref.current;
      const start = el ? el.selectionStart : value.length;
      const end = el ? el.selectionEnd : value.length;
      const before = value.slice(0, start);
      const after = value.slice(end);
      const lead = before && !before.endsWith("\n") ? "\n" : "";
      const snippet = `${lead}![](${url})\n`;
      onChange(before + snippet + after);
      // Put the caret inside the empty alt text ("![|](url)") so a description
      // can be typed straight away — better for accessibility and SEO.
      const altCaret = (before + lead).length + 2;
      window.setTimeout(() => { el?.focus(); el?.setSelectionRange(altCaret, altCaret); }, 0);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.response?.data || "Could not upload the image");
    } finally {
      setUploadingImg(false);
      if (imgRef.current) imgRef.current.value = "";
    }
  };

  /** Wrap the current selection (or a placeholder) in a fenced code block. */
  const insertCodeBlock = () => {
    const el = ref.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const selected = value.slice(start, end) || "// your code here";
    const before = value.slice(0, start);
    const after = value.slice(end);
    const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const block = "```" + language + "\n" + selected + "\n```\n";
    const next = before + lead + block + after;
    onChange(next);
    // put the caret inside the new block so the author can keep typing
    const caret = (before + lead).length + language.length + 4;
    window.setTimeout(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret + selected.length);
    }, 0);
  };

  /** Tab inserts two spaces instead of leaving the field — matters for code. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: en } = el;
    onChange(value.slice(0, s) + "  " + value.slice(en));
    window.setTimeout(() => el.setSelectionRange(s + 2, s + 2), 0);
  };

  const btn = "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <select
          className="rounded-lg border px-2 py-1.5 text-xs bg-transparent"
          style={optStyle}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          title="Language for the inserted code block"
        >
          {CODE_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value} style={optStyle}>{l.label}</option>
          ))}
        </select>
        <button type="button" className={btn} onClick={insertCodeBlock}>
          <Code2 className="h-3.5 w-3.5" /> Insert code block
        </button>
        {onUploadImage && (
          <>
            <button
              type="button"
              className={btn}
              onClick={() => imgRef.current?.click()}
              disabled={uploadingImg}
              title="Upload an image and insert it here"
            >
              {uploadingImg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {uploadingImg ? "Uploading…" : "Insert image"}
            </button>
            <input
              ref={imgRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageChosen(f); }}
            />
          </>
        )}
        <button type="button" className={btn + " ml-auto"} onClick={() => setPreview((p) => !p)}>
          {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {preview ? "Write" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div
          className="rounded-lg border p-4 overflow-y-auto"
          style={{ minHeight: rows * 22, maxHeight: 420, background: "hsl(var(--background))" }}
        >
          {value.trim()
            ? <RichContent text={value} />
            : <p className="text-sm opacity-50">Nothing to preview yet.</p>}
        </div>
      ) : (
        <textarea
          ref={ref}
          className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent font-mono"
          style={{ lineHeight: 1.6 }}
          rows={rows}
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
      )}

      <p className="mt-1.5 text-[11px] opacity-55">
        {hint || "Markdown supported — ``` fences for code, ## headings, - lists, **bold**, `inline code`, ![](image-url)."}
      </p>
    </div>
  );
}
