import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, X, ChevronDown, ChevronRight, FileUp } from "lucide-react";
import api from "@/api/axios";
import EntityModal from "@/components/admin/EntityModal";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { useModalA11y } from "@/components/admin/useModalA11y";

interface KeyPoint { id?: number; point: string; explanation: string; }
interface Lesson { id?: number; title: string; slug?: string; duration?: string; content?: string; keyPoints?: KeyPoint[]; }
interface Module { id: number; title: string; lessons?: Lesson[]; }

const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };

export default function CourseContent({ course, onBack }: { course: any; onBack: () => void }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [moduleModal, setModuleModal] = useState<{ open: boolean; editing: Module | null }>({ open: false, editing: null });
  const [lessonModal, setLessonModal] = useState<{ open: boolean; moduleId: number | null; lesson: Lesson | null }>({ open: false, moduleId: null, lesson: null });
  const [bulkOpen, setBulkOpen] = useState(false);

  const load = () =>
    api.get(`/courses/${course.id}/modules`).then((r) => setModules(r.data || [])).catch(() => setModules([]));
  useEffect(() => { load(); }, [course.id]);

  // ---- modules ----
  const saveModule = async (v: any) => {
    try {
      if (moduleModal.editing) await api.put(`/courses/${course.id}/modules/${moduleModal.editing.id}`, { title: v.title });
      else await api.post(`/courses/${course.id}/modules`, [{ title: v.title }]);
      toast.success("Module saved"); load();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); throw e; }
  };
  const deleteModule = async (m: Module) => {
    if (!confirm(`Delete module "${m.title}" and its lessons?`)) return;
    try { await api.delete(`/courses/${course.id}/modules/${m.id}`); toast.success("Module deleted"); load(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  // ---- bulk import ----
  const importOutline = async (text: string) => {
    const { data } = await api.post(`/courses/${course.id}/modules/import`, { text });
    const added = (data?.modules?.length ?? 0);
    toast.success("Modules imported");
    load();
    return added;
  };

  // ---- lessons ----
  const saveLesson = async (moduleId: number, lesson: Lesson) => {
    try {
      if (lesson.id) await api.put(`/courses/${course.id}/modules/${moduleId}/lessons/${lesson.id}`, lesson);
      else await api.post(`/courses/${course.id}/modules/${moduleId}/lessons`, [lesson]);
      toast.success("Lesson saved"); load();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); throw e; }
  };
  const deleteLesson = async (moduleId: number, lesson: Lesson) => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return;
    try { await api.delete(`/courses/${course.id}/modules/${moduleId}/lessons/${lesson.id}`); toast.success("Lesson deleted"); load(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs tracking-widest text-orange-500 font-mono">// COURSE CONTENT</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{course.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBulkOpen(true)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold">
            <FileUp className="h-4 w-4" /> Bulk import
          </button>
          <button onClick={() => setModuleModal({ open: true, editing: null })}
            className="flex items-center gap-2 rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
            <Plus className="h-4 w-4" /> Add module
          </button>
        </div>
      </div>

      {modules.length === 0 && <p className="opacity-60">No modules yet. Add one to start building the course.</p>}

      <div className="space-y-3">
        {modules.map((m) => (
          <div key={m.id} className="rounded-2xl border">
            <div className="flex items-center justify-between p-4">
              <button className="flex items-center gap-2 font-semibold" onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))}>
                {open[m.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {m.title}
                <span className="text-xs opacity-50">({m.lessons?.length || 0} lessons)</span>
              </button>
              <div className="flex items-center gap-3">
                <button title="Add lesson" aria-label="Add lesson" onClick={() => setLessonModal({ open: true, moduleId: m.id, lesson: null })}
                  className="text-orange-500 flex items-center gap-1 text-sm"><Plus className="h-4 w-4" /> Lesson</button>
                <button title="Edit module" aria-label="Edit module" onClick={() => setModuleModal({ open: true, editing: m })}><Pencil className="h-4 w-4 opacity-70" /></button>
                <button title="Delete module" aria-label="Delete module" onClick={() => deleteModule(m)}><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </div>
            {open[m.id] && (
              <div className="border-t px-4 py-2" style={{ borderColor: "hsl(var(--border))" }}>
                {(m.lessons || []).length === 0 && <p className="text-sm opacity-50 py-2">No lessons yet.</p>}
                {(m.lessons || []).map((l) => (
                  <div key={l.id} className="flex items-center justify-between py-2 text-sm border-b last:border-b-0" style={{ borderColor: "hsl(var(--border))" }}>
                    <div>
                      <span className="font-medium">{l.title}</span>
                      <span className="opacity-50"> · {l.duration || "—"} · {(l.keyPoints?.length || 0)} key points</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button title="Edit lesson" aria-label="Edit lesson" onClick={() => setLessonModal({ open: true, moduleId: m.id, lesson: l })}><Pencil className="h-4 w-4 opacity-70" /></button>
                      <button title="Delete lesson" aria-label="Delete lesson" onClick={() => deleteLesson(m.id, l)}><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Module modal (single title) */}
      <EntityModal
        open={moduleModal.open}
        title={moduleModal.editing ? "Edit module" : "New module"}
        fields={[{ name: "title", label: "Module title", required: true }]}
        initial={moduleModal.editing}
        onClose={() => setModuleModal({ open: false, editing: null })}
        onSubmit={saveModule}
      />

      {/* Lesson modal (with key points) */}
      {lessonModal.open && lessonModal.moduleId != null && (
        <LessonModal
          moduleId={lessonModal.moduleId}
          lesson={lessonModal.lesson}
          onClose={() => setLessonModal({ open: false, moduleId: null, lesson: null })}
          onSave={saveLesson}
        />
      )}

      {/* Bulk import (paste a whole outline, saved in one request) */}
      {bulkOpen && (
        <BulkImportModal onClose={() => setBulkOpen(false)} onImport={importOutline} />
      )}
    </div>
  );
}

// ------------------------------------------------------------ Lesson modal
function LessonModal({ moduleId, lesson, onClose, onSave }: {
  moduleId: number; lesson: Lesson | null;
  onClose: () => void; onSave: (moduleId: number, lesson: Lesson) => Promise<void>;
}) {
  const [form, setForm] = useState<Lesson>(lesson ? { ...lesson, keyPoints: lesson.keyPoints || [] } : { title: "", slug: "", duration: "", content: "", keyPoints: [] });
  const [saving, setSaving] = useState(false);
  const panelRef = useModalA11y(onClose);
  const set = (k: keyof Lesson, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const setKp = (i: number, k: keyof KeyPoint, v: string) =>
    setForm((s) => ({ ...s, keyPoints: (s.keyPoints || []).map((kp, idx) => idx === i ? { ...kp, [k]: v } : kp) }));
  const addKp = () => setForm((s) => ({ ...s, keyPoints: [...(s.keyPoints || []), { point: "", explanation: "" }] }));
  const removeKp = (i: number) => setForm((s) => ({ ...s, keyPoints: (s.keyPoints || []).filter((_, idx) => idx !== i) }));

  const submit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try { await onSave(moduleId, { ...form, keyPoints: (form.keyPoints || []).filter((k) => k.point.trim()) }); onClose(); }
    finally { setSaving(false); }
  };

  const inp = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title"
        className="w-full max-w-3xl rounded-2xl border p-6 max-h-[88vh] overflow-y-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 id="lesson-modal-title" className="text-lg font-bold">{lesson ? "Edit lesson" : "New lesson"}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs opacity-70 mb-1">Title *</label>
            <input className={inp} value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs opacity-70 mb-1">Slug</label>
              <input className={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="intro-to-x" /></div>
            <div><label className="block text-xs opacity-70 mb-1">Duration</label>
              <input className={inp} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="10 min" /></div>
          </div>
          <div>
            <label className="block text-xs opacity-70 mb-1">Content</label>
            <MarkdownEditor
              value={form.content || ""}
              onChange={(v) => set("content", v)}
              rows={12}
              placeholder={"Explain the concept…\n\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello\");\n    }\n}\n```"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs opacity-70">Key points</label>
              <button className="text-orange-500 text-xs flex items-center gap-1" onClick={addKp}><Plus className="h-3 w-3" /> Add</button>
            </div>
            {/* One block per point rather than two inputs on a row.
                The explanation is rendered on the lesson page with the same
                <RichContent /> as the lesson body, so it has always supported
                Markdown and fenced code — but the editor was a single-line
                <input>, which made anything longer than a few words unreadable
                to write and a code block impossible. It now uses the same
                MarkdownEditor as the Content field above. */}
            <div className="space-y-3">
              {(form.keyPoints || []).map((kp, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-3"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted)/.35)" }}
                >
                  <div className="flex gap-2 items-center mb-2">
                    <span
                      className="text-[10px] font-mono opacity-50 flex-shrink-0"
                      style={{ minWidth: 18 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <input
                      className={inp + " flex-1"}
                      placeholder="Point — a short heading"
                      value={kp.point}
                      onChange={(e) => setKp(i, "point", e.target.value)}
                      aria-label={`Key point ${i + 1} heading`}
                    />
                    <button
                      onClick={() => removeKp(i)}
                      aria-label={`Remove key point ${i + 1}`}
                      title="Remove key point"
                      className="p-2 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <MarkdownEditor
                    value={kp.explanation || ""}
                    onChange={(v) => setKp(i, "explanation", v)}
                    rows={4}
                    placeholder={"Explain it — Markdown and code blocks are supported."}
                    hint="Same formatting as the lesson content above."
                  />
                </div>
              ))}
              {(form.keyPoints || []).length === 0 && (
                <p className="text-xs opacity-50">
                  No key points yet. Use “Add” to create one.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" disabled={saving} onClick={submit}>
            {saving ? "Saving…" : lesson ? "Update lesson" : "Add lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Bulk import modal
const BULK_EXAMPLE = `# Module: Introduction
## Lesson: What is Java | 10 min
Java is a general-purpose, object-oriented language.
It runs on the JVM, so the same program works everywhere.
- Runs on the JVM
- Write once, run anywhere :: the same bytecode runs on any OS

## Lesson: Setup | 15 min
Install the JDK and set up your editor.
- Set JAVA_HOME

# Module: Basics
## Lesson: Variables | 8 min
A variable stores a value you can reuse.
- Declare a type, then a name`;

function BulkImportModal({ onClose, onImport }: {
  onClose: () => void; onImport: (text: string) => Promise<number>;
}) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const panelRef = useModalA11y(onClose);

  const submit = async () => {
    if (!text.trim()) { toast.error("Paste an outline first"); return; }
    setSaving(true);
    try { await onImport(text); onClose(); }
    catch (e: any) { toast.error(e.response?.data || e.response?.data?.message || "Import failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="bulk-modal-title"
        className="w-full max-w-3xl rounded-2xl border p-6 max-h-[88vh] overflow-y-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="bulk-modal-title" className="text-lg font-bold">Bulk import modules</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>

        <div className="rounded-lg border p-3 text-xs opacity-80 mb-3 space-y-1">
          <p className="font-semibold opacity-100">Paste your whole outline — it's added in one go.</p>
          <p><code>{"# Module: <title>"}</code> starts a module.</p>
          <p><code>{"## Lesson: <title> | <duration>"}</code> starts a lesson (duration optional).</p>
          <p>Plain lines are lesson content (Markdown). Lines starting with <code>-</code> become key points; add an explanation with <code>point :: explanation</code>.</p>
        </div>

        <textarea
          className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent font-mono"
          rows={16}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={BULK_EXAMPLE}
        />

        <div className="flex items-center justify-between mt-3">
          <button className="text-xs underline opacity-70 hover:opacity-100" onClick={() => setText(BULK_EXAMPLE)}>
            Insert example
          </button>
          <div className="flex gap-3">
            <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
            <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" disabled={saving} onClick={submit}>
              {saving ? "Importing…" : "Save all"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
