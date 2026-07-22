import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, X, ChevronDown, ChevronRight } from "lucide-react";
import api from "@/api/axios";
import { useModalA11y } from "@/components/admin/useModalA11y";

const inp = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";
const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };

export default function ResourceCategoryContent({ category, onBack }: { category: any; onBack: () => void }) {
  const [topics, setTopics] = useState<any[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [questionsByTopic, setQuestionsByTopic] = useState<Record<string, any[]>>({});
  const [topicModal, setTopicModal] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });
  const [mcqModal, setMcqModal] = useState<{ open: boolean; topicId: string | null; question: any | null }>({ open: false, topicId: null, question: null });

  const loadTopics = () =>
    api.get(`/resources/categories/${category.slug}/topics`).then((r) => setTopics(r.data || [])).catch(() => setTopics([]));
  useEffect(() => { loadTopics(); }, [category.slug]);

  const loadQuestions = (topicId: string) =>
    api.get(`/resources/topics/${topicId}/questions`).then((r) =>
      setQuestionsByTopic((m) => ({ ...m, [topicId]: r.data || [] }))).catch(() => {});

  const toggleTopic = (t: any) => {
    const next = !open[t.id];
    setOpen((o) => ({ ...o, [t.id]: next }));
    if (next && !questionsByTopic[t.id]) loadQuestions(t.id);
  };

  // ---- topics ----
  const saveTopic = async (v: any) => {
    try {
      const body = { slug: v.slug, title: v.title, summary: v.summary, difficulty: v.difficulty, duration: v.duration, sortOrder: v.sortOrder ?? 0, concepts: v.concepts || [] };
      if (topicModal.editing) await api.put(`/resources/topics/${topicModal.editing.id}`, body);
      else await api.post(`/resources/categories/${category.id}/topics`, body);
      toast.success("Topic saved"); loadTopics();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); throw e; }
  };
  const deleteTopic = async (t: any) => {
    if (!confirm(`Delete topic "${t.title}" and its questions?`)) return;
    try { await api.delete(`/resources/topics/${t.id}`); toast.success("Topic deleted"); loadTopics(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  // ---- questions ----
  const saveQuestion = async (topicId: string, q: any) => {
    try {
      const body = {
        questionText: q.questionText,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation,
        sortOrder: q.sortOrder ?? 0,
        options: q.options.map((o: string, i: number) => ({ optionText: o, optionIndex: i })),
      };
      if (q.id) await api.put(`/resources/topics/${topicId}/questions/${q.id}`, body);
      else await api.post(`/resources/topics/${topicId}/questions`, body);
      toast.success("Question saved"); loadQuestions(topicId); loadTopics();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); throw e; }
  };
  const deleteQuestion = async (topicId: string, q: any) => {
    if (!confirm("Delete this question?")) return;
    try { await api.delete(`/resources/topics/${topicId}/questions/${q.id}`); toast.success("Question deleted"); loadQuestions(topicId); loadTopics(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to categories
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs tracking-widest text-orange-500 font-mono">// RESOURCE CONTENT</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{category.title}</h1>
        </div>
        <button onClick={() => setTopicModal({ open: true, editing: null })}
          className="flex items-center gap-2 rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add topic
        </button>
      </div>

      {topics.length === 0 && <p className="opacity-60">No topics yet. Add one to start.</p>}

      <div className="space-y-3">
        {topics.map((t) => (
          <div key={t.id} className="rounded-2xl border">
            <div className="flex items-center justify-between p-4">
              <button className="flex items-center gap-2 font-semibold text-left" onClick={() => toggleTopic(t)}>
                {open[t.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {t.title}
                <span className="text-xs opacity-50">({t.questionCount ?? 0} questions · {t.difficulty || "—"})</span>
              </button>
              <div className="flex items-center gap-3">
                <button title="Add question" aria-label="Add question" className="text-orange-500 flex items-center gap-1 text-sm"
                  onClick={() => setMcqModal({ open: true, topicId: t.id, question: null })}><Plus className="h-4 w-4" /> Question</button>
                <button title="Edit topic" aria-label="Edit topic" onClick={() => setTopicModal({ open: true, editing: t })}><Pencil className="h-4 w-4 opacity-70" /></button>
                <button title="Delete topic" aria-label="Delete topic" onClick={() => deleteTopic(t)}><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </div>
            {open[t.id] && (
              <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "hsl(var(--border))" }}>
                {t.concepts?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {t.concepts.map((c: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full border text-xs">{c}</span>
                    ))}
                  </div>
                )}
                {(questionsByTopic[t.id] || []).length === 0 && <p className="text-sm opacity-50">No questions yet.</p>}
                {(questionsByTopic[t.id] || []).map((q) => (
                  <div key={q.id} className="flex items-start justify-between gap-3 py-2 border-b last:border-b-0" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="text-sm">
                      <div className="font-medium">{q.questionText}</div>
                      <div className="opacity-50 text-xs">
                        {[...(q.options || [])].sort((a, b) => a.optionIndex - b.optionIndex).map((o) => o.optionText).join(" · ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button aria-label="Edit question" onClick={() => setMcqModal({ open: true, topicId: t.id, question: q })}><Pencil className="h-4 w-4 opacity-70" /></button>
                      <button aria-label="Delete question" onClick={() => deleteQuestion(t.id, q)}><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {topicModal.open && (
        <TopicModal editing={topicModal.editing} onClose={() => setTopicModal({ open: false, editing: null })} onSave={saveTopic} />
      )}
      {mcqModal.open && mcqModal.topicId && (
        <McqModal question={mcqModal.question} onClose={() => setMcqModal({ open: false, topicId: null, question: null })}
          onSave={(q) => saveQuestion(mcqModal.topicId!, q)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Topic modal
function TopicModal({ editing, onClose, onSave }: { editing: any | null; onClose: () => void; onSave: (v: any) => Promise<void> }) {
  const [form, setForm] = useState<any>(editing
    ? { ...editing, concepts: editing.concepts || [] }
    : { slug: "", title: "", summary: "", difficulty: "Beginner", duration: "", concepts: [] });
  const [saving, setSaving] = useState(false);
  const panelRef = useModalA11y(onClose);
  const set = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));
  const setConcept = (i: number, v: string) => set("concepts", form.concepts.map((c: string, idx: number) => idx === i ? v : c));

  const submit = async () => {
    if (!form.slug.trim() || !form.title.trim()) { toast.error("Slug and title are required"); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) { toast.error("Slug must be lowercase kebab-case (e.g. time-work)"); return; }
    setSaving(true);
    try { await onSave({ ...form, concepts: form.concepts.filter((c: string) => c.trim()) }); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="topic-modal-title"
        className="w-full max-w-lg rounded-2xl border p-6 max-h-[88vh] overflow-y-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 id="topic-modal-title" className="text-lg font-bold">{editing ? "Edit topic" : "New topic"}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs opacity-70 mb-1">Slug *</label>
            <input className={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="time-work" /></div>
          <div><label className="block text-xs opacity-70 mb-1">Title *</label>
            <input className={inp} value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div><label className="block text-xs opacity-70 mb-1">Summary</label>
            <textarea className={inp} rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs opacity-70 mb-1">Difficulty</label>
              <select className={inp} style={optStyle} value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d} value={d} style={optStyle}>{d}</option>)}
              </select></div>
            <div><label className="block text-xs opacity-70 mb-1">Duration</label>
              <input className={inp} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="20 min" /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs opacity-70">Concepts</label>
              <button className="text-orange-500 text-xs flex items-center gap-1" onClick={() => set("concepts", [...form.concepts, ""])}><Plus className="h-3 w-3" /> Add</button>
            </div>
            <div className="space-y-2">
              {form.concepts.map((c: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input className={inp} value={c} onChange={(e) => setConcept(i, e.target.value)} placeholder={`Concept ${i + 1}`} />
                  <button onClick={() => set("concepts", form.concepts.filter((_: any, idx: number) => idx !== i))} aria-label="Remove concept" className="p-2"><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" disabled={saving} onClick={submit}>
            {saving ? "Saving…" : editing ? "Update topic" : "Add topic"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- MCQ modal
function McqModal({ question, onClose, onSave }: { question: any | null; onClose: () => void; onSave: (q: any) => Promise<void> }) {
  const initial = question
    ? {
        id: question.id,
        questionText: question.questionText || "",
        options: [...(question.options || [])].sort((a: any, b: any) => a.optionIndex - b.optionIndex).map((o: any) => o.optionText),
        correctAnswerIndex: question.correctAnswerIndex ?? 0,
        explanation: question.explanation || "",
      }
    : { questionText: "", options: ["", ""], correctAnswerIndex: 0, explanation: "" };
  const [form, setForm] = useState<any>(initial);
  const [saving, setSaving] = useState(false);
  const panelRef = useModalA11y(onClose);
  const set = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));
  const setOpt = (i: number, v: string) => set("options", form.options.map((o: string, idx: number) => idx === i ? v : o));
  const removeOpt = (i: number) => {
    const options = form.options.filter((_: any, idx: number) => idx !== i);
    let correct = form.correctAnswerIndex;
    if (i === correct) correct = 0; else if (i < correct) correct -= 1;
    setForm((s: any) => ({ ...s, options, correctAnswerIndex: correct }));
  };

  const submit = async () => {
    if (!form.questionText.trim()) { toast.error("Question text is required"); return; }
    if (form.options.filter((o: string) => o.trim()).length < 2) { toast.error("At least 2 options required"); return; }
    setSaving(true);
    try {
      await onSave({ ...form, options: form.options.map((o: string) => o.trim()).filter(Boolean),
        correctAnswerIndex: Math.min(form.correctAnswerIndex, form.options.filter((o: string) => o.trim()).length - 1) });
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="mcq-modal-title"
        className="w-full max-w-lg rounded-2xl border p-6 max-h-[88vh] overflow-y-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 id="mcq-modal-title" className="text-lg font-bold">{question ? "Edit question" : "New question"}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs opacity-70 mb-1">Question *</label>
            <textarea className={inp} rows={2} value={form.questionText} onChange={(e) => set("questionText", e.target.value)} /></div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs opacity-70">Options (select the correct one)</label>
              <button className="text-orange-500 text-xs flex items-center gap-1" onClick={() => set("options", [...form.options, ""])}><Plus className="h-3 w-3" /> Add option</button>
            </div>
            <div className="space-y-2">
              {form.options.map((o: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={form.correctAnswerIndex === i} onChange={() => set("correctAnswerIndex", i)} />
                  <input className={inp} value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                  <button onClick={() => removeOpt(i)} disabled={form.options.length <= 2} aria-label="Remove option" className="p-1.5 disabled:opacity-30"><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              ))}
            </div>
          </div>
          <div><label className="block text-xs opacity-70 mb-1">Explanation</label>
            <textarea className={inp} rows={2} value={form.explanation} onChange={(e) => set("explanation", e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50" disabled={saving} onClick={submit}>
            {saving ? "Saving…" : question ? "Update question" : "Add question"}
          </button>
        </div>
      </div>
    </div>
  );
}
