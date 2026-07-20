import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Plus, Trash2 } from "lucide-react";
import api from "@/api/axios";

interface QuizQuestion { question: string; options: string[]; correct: number; }

export default function QuizEditor({ quiz, onClose, onSaved }: {
  quiz: any; onClose: () => void; onSaved: () => void;
}) {
  const [title, setTitle] = useState(quiz.title || "");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${quiz.id}`)
      .then((r) => {
        setTitle(r.data.title || "");
        setQuestions((r.data.questions || []).map((q: any) => ({
          question: q.question || "",
          options: q.options && q.options.length ? [...q.options] : ["", ""],
          correct: typeof q.correct === "number" ? q.correct : 0,
        })));
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [quiz.id]);

  // -- question ops --
  const addQuestion = () => setQuestions((qs) => [...qs, { question: "", options: ["", ""], correct: 0 }]);
  const removeQuestion = (i: number) => setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  const setQ = (i: number, patch: Partial<QuizQuestion>) =>
    setQuestions((qs) => qs.map((q, idx) => idx === i ? { ...q, ...patch } : q));

  // -- option ops --
  const setOption = (qi: number, oi: number, val: string) =>
    setQ(qi, { options: questions[qi].options.map((o, idx) => idx === oi ? val : o) });
  const addOption = (qi: number) => setQ(qi, { options: [...questions[qi].options, ""] });
  const removeOption = (qi: number, oi: number) => {
    const opts = questions[qi].options.filter((_, idx) => idx !== oi);
    let correct = questions[qi].correct;
    if (oi === correct) correct = 0;
    else if (oi < correct) correct -= 1;
    setQ(qi, { options: opts, correct });
  };

  const save = async () => {
    if (!title.trim()) { alert("Quiz title is required"); return; }
    // validate
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) { alert(`Question ${i + 1} text is empty`); return; }
      const filled = q.options.filter((o) => o.trim());
      if (filled.length < 2) { alert(`Question ${i + 1} needs at least 2 options`); return; }
    }
    setSaving(true);
    try {
      // drop blank options; keep correct index aligned
      const cleaned = questions.map((q) => {
        const options = q.options.map((o) => o.trim());
        return { question: q.question.trim(), options, correct: Math.min(q.correct, options.length - 1) };
      });
      await api.put(`/quizzes/${quiz.id}`, { title: title.trim(), courseId: quiz.courseId, questions: cleaned });
      toast.success("Quiz saved");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const inp = "rounded-lg border px-3 py-2 text-sm bg-transparent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border p-6 max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Edit quiz questions</h2>
          <button onClick={onClose}><X className="h-5 w-5 opacity-60" /></button>
        </div>

        <label className="block text-xs opacity-70 mb-1">Quiz title *</label>
        <input className={inp + " w-full mb-5"} value={title} onChange={(e) => setTitle(e.target.value)} />

        {loading ? <p className="opacity-60">Loading…</p> : (
          <div className="space-y-4">
            {questions.length === 0 && <p className="opacity-60 text-sm">No questions yet. Add one below.</p>}
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-xl border p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-sm font-semibold mt-2">{qi + 1}.</span>
                  <textarea className={inp + " flex-1"} rows={2} placeholder="Question text"
                    value={q.question} onChange={(e) => setQ(qi, { question: e.target.value })} />
                  <button title="Remove question" onClick={() => removeQuestion(qi)} className="p-2"><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
                <div className="space-y-2 pl-6">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" name={`correct-${qi}`} checked={q.correct === oi}
                        onChange={() => setQ(qi, { correct: oi })} title="Mark as correct answer" />
                      <input className={inp + " flex-1"} placeholder={`Option ${oi + 1}`}
                        value={opt} onChange={(e) => setOption(qi, oi, e.target.value)} />
                      <button onClick={() => removeOption(qi, oi)} disabled={q.options.length <= 2}
                        className="p-1.5 disabled:opacity-30"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  ))}
                  <button className="text-orange-500 text-xs flex items-center gap-1" onClick={() => addOption(qi)}>
                    <Plus className="h-3 w-3" /> Add option
                  </button>
                  <p className="text-[11px] opacity-50">Select the radio next to the correct option.</p>
                </div>
              </div>
            ))}
            <button onClick={addQuestion} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
              <Plus className="h-4 w-4" /> Add question
            </button>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            disabled={saving} onClick={save}>{saving ? "Saving…" : "Save quiz"}</button>
        </div>
      </div>
    </div>
  );
}
