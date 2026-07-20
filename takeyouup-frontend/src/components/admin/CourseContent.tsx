import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, X, ChevronDown, ChevronRight } from "lucide-react";
import api from "@/api/axios";
import EntityModal from "@/components/admin/EntityModal";

interface KeyPoint { id?: number; point: string; explanation: string; }
interface Lesson { id?: number; title: string; slug?: string; duration?: string; content?: string; keyPoints?: KeyPoint[]; }
interface Module { id: number; title: string; lessons?: Lesson[]; }

const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };

export default function CourseContent({ course, onBack }: { course: any; onBack: () => void }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [moduleModal, setModuleModal] = useState<{ open: boolean; editing: Module | null }>({ open: false, editing: null });
  const [lessonModal, setLessonModal] = useState<{ open: boolean; moduleId: number | null; lesson: Lesson | null }>({ open: false, moduleId: null, lesson: null });

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
        <button onClick={() => setModuleModal({ open: true, editing: null })}
          className="flex items-center gap-2 rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add module
        </button>
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
                <button title="Add lesson" onClick={() => setLessonModal({ open: true, moduleId: m.id, lesson: null })}
                  className="text-orange-500 flex items-center gap-1 text-sm"><Plus className="h-4 w-4" /> Lesson</button>
                <button title="Edit module" onClick={() => setModuleModal({ open: true, editing: m })}><Pencil className="h-4 w-4 opacity-70" /></button>
                <button title="Delete module" onClick={() => deleteModule(m)}><Trash2 className="h-4 w-4 text-red-500" /></button>
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
                      <button title="Edit lesson" onClick={() => setLessonModal({ open: true, moduleId: m.id, lesson: l })}><Pencil className="h-4 w-4 opacity-70" /></button>
                      <button title="Delete lesson" onClick={() => deleteLesson(m.id, l)}><Trash2 className="h-4 w-4 text-red-500" /></button>
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
  const set = (k: keyof Lesson, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const setKp = (i: number, k: keyof KeyPoint, v: string) =>
    setForm((s) => ({ ...s, keyPoints: (s.keyPoints || []).map((kp, idx) => idx === i ? { ...kp, [k]: v } : kp) }));
  const addKp = () => setForm((s) => ({ ...s, keyPoints: [...(s.keyPoints || []), { point: "", explanation: "" }] }));
  const removeKp = (i: number) => setForm((s) => ({ ...s, keyPoints: (s.keyPoints || []).filter((_, idx) => idx !== i) }));

  const submit = async () => {
    if (!form.title.trim()) { alert("Title is required"); return; }
    setSaving(true);
    try { await onSave(moduleId, { ...form, keyPoints: (form.keyPoints || []).filter((k) => k.point.trim()) }); onClose(); }
    finally { setSaving(false); }
  };

  const inp = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl border p-6 max-h-[88vh] overflow-y-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{lesson ? "Edit lesson" : "New lesson"}</h2>
          <button onClick={onClose}><X className="h-5 w-5 opacity-60" /></button>
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
          <div><label className="block text-xs opacity-70 mb-1">Content</label>
            <textarea className={inp} rows={4} value={form.content} onChange={(e) => set("content", e.target.value)} /></div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs opacity-70">Key points</label>
              <button className="text-orange-500 text-xs flex items-center gap-1" onClick={addKp}><Plus className="h-3 w-3" /> Add</button>
            </div>
            <div className="space-y-2">
              {(form.keyPoints || []).map((kp, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input className={inp + " flex-1"} placeholder="Point" value={kp.point} onChange={(e) => setKp(i, "point", e.target.value)} />
                  <input className={inp + " flex-1"} placeholder="Explanation" value={kp.explanation} onChange={(e) => setKp(i, "explanation", e.target.value)} />
                  <button onClick={() => removeKp(i)} className="p-2"><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              ))}
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
