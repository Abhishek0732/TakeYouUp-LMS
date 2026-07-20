import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";

type Tab = "courses" | "topics" | "questions" | "quizzes";

const inputCls =
  "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";
const btnCls =
  "rounded-lg px-4 py-2 text-sm font-semibold text-white";

export default function Admin() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [tab, setTab] = useState<Tab>("courses");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-xs tracking-widest text-orange-500 font-mono mb-2">// ADMIN</p>
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
        Admin Dashboard
      </h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        {(["courses", "topics", "questions", "quizzes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              tab === t ? "bg-orange-500 text-white" : "border"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "courses" && <CoursesPanel />}
      {tab === "topics" && <TopicsPanel />}
      {tab === "questions" && <QuestionsPanel />}
      {tab === "quizzes" && <QuizzesPanel />}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="rounded-2xl border p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

// -------------------------------------------------------------- Courses
function CoursesPanel() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    title: "", slug: "", category: "Programming", level: "Beginner",
    duration: "", instructor: "", price: "Free", description: "",
  });

  const load = () => api.get("/courses/basic").then((r) => setCourses(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await api.post("/courses", { ...form, students: 0, rating: 0 });
      toast.success("Course created");
      setForm({ ...form, title: "", slug: "", description: "" });
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create course");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try { await api.delete(`/courses/${id}`); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <Section title={`Courses (${courses.length})`}>
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        {["title", "slug", "category", "level", "duration", "instructor", "price"].map((f) => (
          <input key={f} className={inputCls} placeholder={f}
            value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
        ))}
        <textarea className={inputCls + " md:col-span-2"} placeholder="description"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <button className={btnCls + " bg-orange-500 mb-6"} onClick={create}>Create course</button>

      <ul className="divide-y">
        {courses.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-3">
            <span>{c.title} <span className="opacity-50 text-xs">/{c.slug}</span></span>
            <button className="text-red-500 text-sm" onClick={() => remove(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// -------------------------------------------------------------- Topics
function TopicsPanel() {
  const [topics, setTopics] = useState<any[]>([]);
  const [name, setName] = useState("");

  const load = () => api.get("/topics").then((r) => setTopics(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    try { await api.post("/topics", { name }); toast.success("Topic added"); setName(""); load(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <Section title={`DSA Topics (${topics.length})`}>
      <div className="flex gap-2 mb-4">
        <input className={inputCls} placeholder="New topic name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className={btnCls + " bg-orange-500 whitespace-nowrap"} onClick={add}>Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <span key={t.id} className="px-3 py-1 rounded-full border text-sm">{t.name}</span>
        ))}
      </div>
    </Section>
  );
}

// -------------------------------------------------------------- Questions
function QuestionsPanel() {
  const [form, setForm] = useState<any>({ title: "", url: "", topic: "", platform: "", difficulty: "" });
  const [topics, setTopics] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [difficulties, setDifficulties] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  const loadRecent = () =>
    api.get("/questions", { params: { size: 10 } }).then((r) => setRecent(r.data.content || [])).catch(() => {});

  // Load the dropdown options (topics/platforms/difficulties you've created)
  useEffect(() => {
    api.get("/topics").then((r) => setTopics(r.data)).catch(() => {});
    api.get("/platforms").then((r) => setPlatforms(r.data)).catch(() => {});
    api.get("/difficulties").then((r) => setDifficulties(r.data)).catch(() => {});
    loadRecent();
  }, []);

  const add = async () => {
    if (!form.topic) { toast.error("Please pick a topic"); return; }
    try {
      await api.post("/questions", form);
      toast.success("Question added");
      setForm({ ...form, title: "", url: "" });
      loadRecent();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <Section title="Add DSA Question">
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <input className={inputCls} placeholder="Title"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={inputCls} placeholder="URL (e.g. https://leetcode.com/…)"
          value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />

        <select className={inputCls} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
          <option value="">Select a topic…</option>
          {topics.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>

        <select className={inputCls} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
          <option value="">Platform (optional)…</option>
          {platforms.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        <select className={inputCls} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
          <option value="">Difficulty (optional)…</option>
          {difficulties.map((d) => <option key={d.id} value={d.level}>{d.level}</option>)}
        </select>
      </div>
      <p className="text-xs opacity-60 mb-3">
        Don't see your topic? Add it in the <strong>Topics</strong> tab, then it appears here.
      </p>
      <button className={btnCls + " bg-orange-500 mb-6"} onClick={add}>Add question</button>

      <h3 className="text-sm font-semibold mb-2 opacity-70">Recently added</h3>
      <ul className="divide-y">
        {recent.map((q) => (
          <li key={q.id} className="py-2 text-sm flex justify-between">
            <span>{q.title}</span>
            <span className="opacity-50">{q.topic}{q.difficulty ? ` · ${q.difficulty}` : ""}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// -------------------------------------------------------------- Quizzes
function QuizzesPanel() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => { api.get("/courses/basic").then((r) => setCourses(r.data)).catch(() => {}); }, []);
  useEffect(() => {
    if (courseId) api.get(`/quizzes/course/${courseId}`).then((r) => setQuizzes(r.data)).catch(() => setQuizzes([]));
  }, [courseId]);

  const create = async () => {
    if (!courseId || !title.trim()) { toast.error("Pick a course and enter a title"); return; }
    try {
      await api.post("/quizzes", {
        title, courseId: Number(courseId),
        questions: [{ question: "Sample question?", options: ["A", "B", "C", "D"], correct: 0 }],
      });
      toast.success("Quiz created (edit questions via API)");
      setTitle("");
      api.get(`/quizzes/course/${courseId}`).then((r) => setQuizzes(r.data));
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const remove = async (id: number) => {
    try { await api.delete(`/quizzes/${id}`); toast.success("Deleted"); setQuizzes(quizzes.filter((q) => q.id !== id)); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <Section title="Quizzes">
      <select className={inputCls + " mb-4"} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        <option value="">Select a course…</option>
        {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      {courseId && (
        <>
          <div className="flex gap-2 mb-4">
            <input className={inputCls} placeholder="New quiz title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className={btnCls + " bg-orange-500 whitespace-nowrap"} onClick={create}>Create</button>
          </div>
          <ul className="divide-y">
            {quizzes.map((q) => (
              <li key={q.id} className="flex justify-between py-2 text-sm">
                <span>{q.title} <span className="opacity-50">({q.questions?.length || 0} Q)</span></span>
                <button className="text-red-500" onClick={() => remove(q.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
