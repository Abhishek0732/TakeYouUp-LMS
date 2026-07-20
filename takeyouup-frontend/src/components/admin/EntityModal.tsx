import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  readOnlyOnEdit?: boolean;
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

  useEffect(() => { if (open) setValues(initial ? { ...initial } : {}); }, [open, initial]);

  if (!open) return null;

  const set = (k: string, v: any) => setValues((s: any) => ({ ...s, [k]: v }));

  const submit = async () => {
    for (const f of fields) {
      if (f.required && !String(values[f.name] ?? "").trim()) { alert(`${f.label} is required`); return; }
    }
    setSaving(true);
    try { await onSubmit(values); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}><X className="h-5 w-5 opacity-60" /></button>
        </div>

        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium mb-1 opacity-70">
                {f.label}{f.required && <span className="text-orange-500"> *</span>}
              </label>
              {f.type === "textarea" ? (
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
