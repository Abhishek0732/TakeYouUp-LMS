import React, { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { X, Upload, Trash2, ImageIcon } from "lucide-react";
import { useModalA11y } from "@/components/admin/useModalA11y";

export interface Field {
  name: string;
  label: string;
  /**
   * "image" renders a file picker with a live preview. On submit the chosen
   * File arrives as `values[<name>File]` and a cleared image as
   * `values[<name>Cleared] === true`; `values[<name>]` keeps the existing URL.
   */
  type?: "text" | "textarea" | "number" | "select" | "image";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  readOnlyOnEdit?: boolean;
  /** Helper text under the input. */
  hint?: string;
}

interface Props {
  open: boolean;
  title: string;
  fields: Field[];
  initial?: any;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void> | void;
}

const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };

export default function EntityModal({ open, title, fields, initial, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial;
  const panelRef = useModalA11y(onClose);
  const titleId = useId();

  useEffect(() => { if (open) setValues(initial ? { ...initial } : {}); }, [open, initial]);

  if (!open) return null;

  const set = (k: string, v: any) => setValues((s: any) => ({ ...s, [k]: v }));

  const submit = async () => {
    for (const f of fields) {
      if (f.type === "image") continue;
      if (f.required && !String(values[f.name] ?? "").trim()) { toast.error(`${f.label} is required`); return; }
    }
    setSaving(true);
    try { await onSubmit(values); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="w-full max-w-lg rounded-2xl border p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 id={titleId} className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>

        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium mb-1 opacity-70">
                {f.label}{f.required && <span className="text-orange-500"> *</span>}
              </label>
              {f.type === "image" ? (
                <ImageField
                  url={values[f.name]}
                  file={values[`${f.name}File`] ?? null}
                  cleared={!!values[`${f.name}Cleared`]}
                  onPick={(file) => setValues((s: any) => ({ ...s, [`${f.name}File`]: file, [`${f.name}Cleared`]: false }))}
                  onClear={() => setValues((s: any) => ({ ...s, [`${f.name}File`]: null, [`${f.name}Cleared`]: true }))}
                />
              ) : f.type === "textarea" ? (
                <textarea className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent" rows={3}
                  placeholder={f.placeholder} value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)} />
              ) : f.type === "select" ? (
                <select className="w-full rounded-lg border px-3 py-2 text-sm" style={optStyle}
                  value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="" style={optStyle}>— select —</option>
                  {(f.options || []).map((o) => (
                    <option key={o.value} value={o.value} style={optStyle}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input type={f.type === "number" ? "number" : "text"}
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent disabled:opacity-50"
                  placeholder={f.placeholder} value={values[f.name] ?? ""}
                  disabled={isEdit && f.readOnlyOnEdit}
                  onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.hint && <p className="mt-1 text-[11px] opacity-55">{f.hint}</p>}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            disabled={saving} onClick={submit}>{saving ? "Saving…" : isEdit ? "Update" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------- image picker
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function ImageField({ url, file, cleared, onPick, onClear }: {
  url?: string | null;
  file: File | null;
  cleared: boolean;
  onPick: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Object URLs must be revoked or the blob leaks for the page's lifetime.
  useEffect(() => {
    if (!file) { setLocalPreview(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const preview = localPreview || (cleared ? null : url || null);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (chosen.size > MAX_IMAGE_BYTES) { toast.error("Image must be 5 MB or smaller"); return; }
    onPick(chosen);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-24 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border"
        style={{ background: "hsl(var(--muted))" }}
      >
        {preview
          ? <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
          : <ImageIcon className="h-6 w-6 opacity-40" />}
      </div>
      <div className="flex flex-col gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
          <Upload className="h-3.5 w-3.5" /> {preview ? "Replace image" : "Choose image"}
        </button>
        {preview && (
          <button type="button" onClick={onClear}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Remove image
          </button>
        )}
        <p className="text-[11px] opacity-55">PNG, JPG, WEBP, GIF or SVG · max 5 MB</p>
      </div>
    </div>
  );
}
