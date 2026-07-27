import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, BookOpen, ListChecks, Code2, Tags, Server, Gauge,
  FolderTree, Users as UsersIcon, Layers, Image as ImageIcon, Menu, X,
  FileText, Type, Newspaper, Hash, UserSquare,
} from "lucide-react";
import api from "@/api/axios";
import DataGrid, { Column } from "@/components/admin/DataGrid";
import EntityModal, { Field } from "@/components/admin/EntityModal";
import CourseContent from "@/components/admin/CourseContent";
import QuizEditor from "@/components/admin/QuizEditor";
import ResourceCategoryContent from "@/components/admin/ResourceCategoryContent";
import PageContent from "@/components/admin/PageContent";
import PageText from "@/components/admin/PageText";
import BlogModeration from "@/components/admin/BlogModeration";
import { fetchAdminTopics, createTopic, updateTopic, deleteTopic } from "@/api/blog";
import useSeo from "@/hooks/useSeo";

/** EntityModal hands back strings; the topic API wants typed sort/active. */
const normalizeTopic = (v: any) => ({
  name: v.name,
  slug: v.slug?.trim() || undefined,
  description: v.description?.trim() || undefined,
  sortOrder: v.sortOrder === "" || v.sortOrder == null ? undefined : Number(v.sortOrder),
  active: v.active === "" || v.active == null ? true : v.active === true || v.active === "true",
});

// ---------------------------------------------------------------- helpers
const clientPager = (loader: () => Promise<any[]>, searchKeys: string[]) =>
  async ({ page, size, search }: any) => {
    const all = await loader();
    const q = (search || "").trim().toLowerCase();
    const filtered = q
      ? all.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)))
      : all;
    return { rows: filtered.slice(page * size, page * size + size), total: filtered.length };
  };

const yn = (v: any) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: v ? "rgba(34,197,94,0.15)" : "rgba(148,163,184,0.15)", color: v ? "#22c55e" : "#94a3b8" }}>
    {v ? "Yes" : "No"}
  </span>
);

/** Grid thumbnail for a course cover; `src` is host-relative (/uploads/…). */
const CoverThumb = ({ src }: { src?: string | null }) => (
  <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md border"
    style={{ background: "hsl(var(--muted))" }}>
    {src
      ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      : <ImageIcon className="h-3.5 w-3.5 opacity-40" />}
  </div>
);

// ---------------------------------------------------------------- resource view
interface ResourceConfig {
  title: string;
  createLabel?: string;
  columns: Column[];
  fields?: Field[];
  idKey?: string;
  fetchPage: (a: any) => Promise<{ rows: any[]; total: number }>;
  create?: (v: any) => Promise<any>;
  update?: (row: any, v: any) => Promise<any>;
  remove?: (row: any) => Promise<any>;
  renderFilters?: (state: any, setState: (s: any) => void) => React.ReactNode;
  rowActions?: (row: any) => React.ReactNode;
}

function ResourceView({ config }: { config: ResourceConfig }) {
  const [reload, setReload] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterState, setFilterState] = useState<any>({});

  const bump = () => setReload((n) => n + 1);

  const onSubmit = async (values: any) => {
    try {
      if (editing && config.update) await config.update(editing, values);
      else if (config.create) await config.create(values);
      toast.success(editing ? "Updated" : "Created");
      bump();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Save failed");
      throw e;
    }
  };

  const onDelete = async (row: any) => {
    try { await config.remove!(row); toast.success("Deleted"); bump(); }
    catch (e: any) { toast.error(e.response?.data?.message || "Delete failed (is it still in use?)"); }
  };

  const onBulkDelete = async (rows: any[]) => {
    let ok = 0;
    let firstError = "";
    for (const r of rows) {
      try { await config.remove!(r); ok++; }
      catch (e: any) {
        if (!firstError) firstError = e?.response?.data?.message || e?.message || "Delete failed";
      }
    }
    if (ok === rows.length) toast.success(`Deleted ${ok}/${rows.length}`);
    else toast.error(`Deleted ${ok}/${rows.length} — ${firstError}`);
    bump();
  };

  return (
    <>
      <DataGrid
        title={config.title}
        columns={config.columns}
        idKey={config.idKey}
        reloadToken={reload}
        fetchPage={config.fetchPage}
        createLabel={config.create ? config.createLabel : undefined}
        onCreate={config.create ? () => { setEditing(null); setModalOpen(true); } : undefined}
        onEdit={config.update ? (row) => { setEditing(row); setModalOpen(true); } : undefined}
        onDelete={config.remove ? onDelete : undefined}
        onBulkDelete={config.remove ? onBulkDelete : undefined}
        rowActions={config.rowActions}
        filterState={filterState}
        filters={config.renderFilters ? config.renderFilters(filterState, setFilterState) : undefined}
      />
      {config.fields && (
        <EntityModal
          open={modalOpen}
          title={`${editing ? "Edit" : "New"} ${config.createLabel?.replace(/^Create /, "") || "record"}`}
          fields={config.fields}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------- dashboard
function Dashboard() {
  const [stats, setStats] = useState<any>({});
  useEffect(() => {
    // `null` marks a figure we could not load — it must never be shown as a real 0.
    Promise.all([
      api.get("/courses/basic").then((r) => r.data.length).catch(() => null),
      api.get("/questions", { params: { size: 1 } }).then((r) => r.data.totalElements ?? 0).catch(() => null),
      api.get("/topics").then((r) => r.data.length).catch(() => null),
      api.get("/resources/categories").then((r) => r.data.length).catch(() => null),
      api.get("/users").then((r) => r.data.length).catch(() => null),
    ]).then(([courses, questions, topics, categories, users]) =>
      setStats({ courses, questions, topics, categories, users }));
  }, []);
  const cards = [
    { label: "Courses", value: stats.courses, icon: BookOpen },
    { label: "DSA Questions", value: stats.questions, icon: Code2 },
    { label: "DSA Topics", value: stats.topics, icon: Tags },
    { label: "Resource Categories", value: stats.categories, icon: FolderTree },
    { label: "Users", value: stats.users, icon: UsersIcon },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const failed = c.value === null;
          return (
            <div key={c.label} className="rounded-2xl border p-5"
              title={failed ? `Couldn't load ${c.label.toLowerCase()}` : undefined}>
              <c.icon className="h-5 w-5 text-orange-500 mb-3" />
              <div className="text-3xl font-bold">{failed ? "—" : c.value ?? "…"}</div>
              <div className="text-sm opacity-60">{c.label}</div>
              {failed && <div className="text-xs opacity-50 mt-0.5">couldn't load</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- quizzes (course-scoped)
function QuizzesView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => { api.get("/courses/basic").then((r) => setCourses(r.data)).catch(() => {}); }, []);

  const cfg: ResourceConfig | null = courseId ? {
    title: "Quizzes",
    createLabel: "Create Quiz",
    idKey: "id",
    columns: [
      { key: "id", label: "ID", width: "70px" },
      { key: "title", label: "Title" },
      { key: "questions", label: "Questions", render: (r) => (r.questions?.length || 0) },
    ],
    fields: [{ name: "title", label: "Quiz title", required: true }],
    fetchPage: clientPager(() => api.get(`/quizzes/course/${courseId}`).then((r) => r.data), ["title"]),
    // Create an empty quiz; questions are added via the "Questions" editor.
    create: (v) => api.post("/quizzes", { title: v.title, courseId: Number(courseId), questions: [] }),
    remove: (row) => api.delete(`/quizzes/${row.id}`),
    rowActions: (row) => (
      <button title="Edit questions & options" className="text-orange-500 flex items-center gap-1 text-sm"
        onClick={() => setEditingQuiz({ ...row, courseId: row.courseId ?? Number(courseId) })}>
        <ListChecks className="h-4 w-4" /> Questions
      </button>
    ),
  } : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm opacity-70">Course:</span>
        <select className="rounded-lg border px-3 py-2 text-sm"
          style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
          value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="" style={{ background: "hsl(var(--card))" }}>Select a course…</option>
          {courses.map((c) => <option key={c.id} value={String(c.id)} style={{ background: "hsl(var(--card))" }}>{c.title}</option>)}
        </select>
      </div>
      {cfg ? <ResourceView key={`${courseId}-${reloadKey}`} config={cfg} /> : <p className="opacity-60">Pick a course to manage its quizzes.</p>}
      {editingQuiz && (
        <QuizEditor quiz={editingQuiz} onClose={() => setEditingQuiz(null)} onSaved={() => setReloadKey((k) => k + 1)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- main
type NavItem = { key: string; label: string; icon: any };
const NAV: { section: string; items: NavItem[] }[] = [
  { section: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { section: "Catalog", items: [
    { key: "courses", label: "Courses", icon: BookOpen },
    { key: "quizzes", label: "Quizzes", icon: ListChecks },
  ] },
  { section: "DSA", items: [
    { key: "questions", label: "Questions", icon: Code2 },
    { key: "topics", label: "Topics", icon: Tags },
    { key: "platforms", label: "Platforms", icon: Server },
    { key: "difficulties", label: "Difficulties", icon: Gauge },
  ] },
  { section: "Resources", items: [{ key: "categories", label: "Categories", icon: FolderTree }] },
  { section: "Blog", items: [
    { key: "blogModeration", label: "Moderation", icon: Newspaper },
    { key: "blogTopics", label: "Topics", icon: Hash },
  ] },
  { section: "Site copy", items: [
    { key: "pageContent", label: "Page Content", icon: FileText },
    { key: "pageText", label: "Page Text", icon: Type },
  ] },
  { section: "People", items: [
    { key: "team", label: "Team", icon: UserSquare },
    { key: "users", label: "Users", icon: UsersIcon },
  ] },
];

export default function Admin() {
  useSeo({
    title: "Admin",
    description:
      "Staff console for managing the catalogue: courses and lessons, quizzes, coding questions with their topics and platforms, resources and users.",
    noindex: true,
  });

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("dashboard");
  const [manageCourse, setManageCourse] = useState<any>(null);
  const [manageCategory, setManageCategory] = useState<any>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [lookups, setLookups] = useState<{ topics: any[]; platforms: any[]; difficulties: any[] }>({ topics: [], platforms: [], difficulties: [] });

  // Escape closes the mobile nav drawer.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setNavOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  useEffect(() => {
    if (role !== "ADMIN") return;
    Promise.all([
      api.get("/topics").then((r) => r.data).catch(() => []),
      api.get("/platforms").then((r) => r.data).catch(() => []),
      api.get("/difficulties").then((r) => r.data).catch(() => []),
    ]).then(([topics, platforms, difficulties]) => setLookups({ topics, platforms, difficulties }));
  }, [role, active]);

  const configs: Record<string, ResourceConfig> = useMemo(() => ({
    courses: {
      title: "Courses",
      createLabel: "Create Course",
      columns: [
        { key: "image", label: "Cover", width: "90px", render: (r) => <CoverThumb src={r.image} /> },
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level" },
        { key: "students", label: "Students" },
        { key: "rating", label: "Rating" },
      ],
      fields: [
        { name: "image", label: "Cover image", type: "image" },
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true, placeholder: "e.g. data-structures" },
        { name: "category", label: "Category", type: "select", options: ["Programming", "Development", "AI/ML"].map((v) => ({ value: v, label: v })) },
        { name: "level", label: "Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"].map((v) => ({ value: v, label: v })) },
        { name: "duration", label: "Duration", placeholder: "e.g. 8 weeks" },
        { name: "instructor", label: "Instructor" },
        { name: "price", label: "Price", placeholder: "Free" },
        { name: "description", label: "Description", type: "textarea" },
      ],
      fetchPage: clientPager(() => api.get("/courses/basic").then((r) => r.data), ["title", "slug", "category", "level"]),
      create: (v) => {
        // One multipart request so the cover is stored with the course itself.
        const { imageFile, imageCleared, ...rest } = v;
        const fd = new FormData();
        fd.append("course", new Blob([JSON.stringify({ ...rest, image: null, students: 0, rating: 0 })],
          { type: "application/json" }));
        if (imageFile) fd.append("image", imageFile);
        return api.post("/courses", fd);
      },
      update: async (row, v) => {
        const { imageFile, imageCleared, ...rest } = v;
        const fd = new FormData();
        fd.append("course", new Blob([JSON.stringify({ ...row, ...rest })], { type: "application/json" }));
        if (imageFile) fd.append("image", imageFile);
        await api.patch(`/courses/${row.id}`, fd);
        // Removing the cover is a separate call — PATCH only ever sets an image.
        if (!imageFile && imageCleared) await api.delete(`/courses/${row.id}/image`);
      },
      remove: (row) => api.delete(`/courses/${row.id}`),
      rowActions: (row) => (
        <button title="Manage content (modules & lessons)" className="text-orange-500 flex items-center gap-1 text-sm"
          onClick={() => setManageCourse(row)}>
          <Layers className="h-4 w-4" /> Content
        </button>
      ),
    },
    questions: {
      title: "DSA Questions",
      createLabel: "Create Question",
      columns: [
        { key: "title", label: "Title" },
        { key: "topic", label: "Topic" },
        { key: "difficulty", label: "Difficulty" },
        { key: "platform", label: "Platform" },
        { key: "url", label: "Link", render: (r) => r.url ? <a className="text-orange-500" href={r.url} target="_blank" rel="noreferrer">open</a> : "" },
      ],
      fields: [
        { name: "title", label: "Title", required: true },
        { name: "url", label: "URL", placeholder: "https://leetcode.com/…" },
        { name: "topic", label: "Topic", type: "select", required: true, options: lookups.topics.map((t: any) => ({ value: t.name, label: t.name })) },
        { name: "platform", label: "Platform", type: "select", options: lookups.platforms.map((p: any) => ({ value: p.name, label: p.name })) },
        { name: "difficulty", label: "Difficulty", type: "select", options: lookups.difficulties.map((d: any) => ({ value: d.level, label: d.level })) },
      ],
      fetchPage: async ({ page, size, search, filters }: any) => {
        const params: any = { page, size };
        if (search) params.search = search;
        if (filters?.topic) params.topic = filters.topic;
        if (filters?.difficulty) params.difficulty = filters.difficulty;
        const r = await api.get("/questions", { params });
        return { rows: r.data.content || [], total: r.data.totalElements ?? (r.data.content?.length || 0) };
      },
      create: (v) => api.post("/questions", v),
      update: (row, v) => api.put(`/questions/${row.id}`, v),
      remove: (row) => api.delete(`/questions/${row.id}`),
      renderFilters: (state, setState) => (
        <>
          <select className="rounded-lg border px-2 py-2 text-sm" style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
            value={state.topic || ""} onChange={(e) => setState({ ...state, topic: e.target.value })}>
            <option value="" style={{ background: "hsl(var(--card))" }}>All topics</option>
            {lookups.topics.map((t: any) => <option key={t.id} value={t.name} style={{ background: "hsl(var(--card))" }}>{t.name}</option>)}
          </select>
          <select className="rounded-lg border px-2 py-2 text-sm" style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
            value={state.difficulty || ""} onChange={(e) => setState({ ...state, difficulty: e.target.value })}>
            <option value="" style={{ background: "hsl(var(--card))" }}>All difficulties</option>
            {lookups.difficulties.map((d: any) => <option key={d.id} value={d.level} style={{ background: "hsl(var(--card))" }}>{d.level}</option>)}
          </select>
        </>
      ),
    },
    topics: {
      title: "DSA Topics", createLabel: "Create Topic",
      columns: [{ key: "id", label: "ID", width: "70px" }, { key: "name", label: "Name" }],
      fields: [{ name: "name", label: "Name", required: true }],
      fetchPage: clientPager(() => api.get("/topics").then((r) => r.data), ["name"]),
      create: (v) => api.post("/topics", { name: v.name }),
      update: (row, v) => api.put(`/topics/${row.id}`, { name: v.name }),
      remove: (row) => api.delete(`/topics/${row.id}`),
    },
    platforms: {
      title: "DSA Platforms", createLabel: "Create Platform",
      columns: [{ key: "id", label: "ID", width: "70px" }, { key: "name", label: "Name" }],
      fields: [{ name: "name", label: "Name", required: true }],
      fetchPage: clientPager(() => api.get("/platforms").then((r) => r.data), ["name"]),
      create: (v) => api.post("/platforms", { name: v.name }),
      update: (row, v) => api.put(`/platforms/${row.id}`, { name: v.name }),
      remove: (row) => api.delete(`/platforms/${row.id}`),
    },
    difficulties: {
      title: "DSA Difficulties", createLabel: "Create Difficulty",
      columns: [{ key: "id", label: "ID", width: "70px" }, { key: "level", label: "Level" }],
      fields: [{ name: "level", label: "Level", required: true }],
      fetchPage: clientPager(() => api.get("/difficulties").then((r) => r.data), ["level"]),
      create: (v) => api.post("/difficulties", { level: v.level }),
      update: (row, v) => api.put(`/difficulties/${row.id}`, { level: v.level }),
      remove: (row) => api.delete(`/difficulties/${row.id}`),
    },
    categories: {
      title: "Resource Categories", createLabel: "Create Category",
      columns: [
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "shortTitle", label: "Short" },
        { key: "accent", label: "Accent", render: (r) => (
          <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full inline-block" style={{ background: r.accent }} />{r.accent}</span>
        ) },
      ],
      fields: [
        { name: "slug", label: "Slug", required: true, readOnlyOnEdit: true },
        { name: "title", label: "Title", required: true },
        { name: "shortTitle", label: "Short title" },
        { name: "accent", label: "Accent colour", placeholder: "#ff4d1c" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "heroText", label: "Hero text", type: "textarea" },
      ],
      fetchPage: clientPager(() => api.get("/resources/categories").then((r) => r.data), ["title", "slug", "shortTitle"]),
      create: (v) => api.post("/resources/categories", v),
      update: (row, v) => api.put(`/resources/categories/${row.id}`, { ...row, ...v }),
      remove: (row) => api.delete(`/resources/categories/${row.id}`),
      rowActions: (row) => (
        <button title="Manage topics & questions" className="text-orange-500 flex items-center gap-1 text-sm"
          onClick={() => setManageCategory(row)}>
          <Layers className="h-4 w-4" /> Content
        </button>
      ),
    },
    blogTopics: {
      title: "Blog Topics", createLabel: "Create Topic", idKey: "id",
      columns: [
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "postCount", label: "Posts", width: "80px" },
        { key: "sortOrder", label: "Order", width: "80px" },
        { key: "active", label: "Status", width: "100px", render: (r) => yn(r.active) },
      ],
      fields: [
        { name: "name", label: "Name", required: true },
        { name: "slug", label: "Slug", placeholder: "Left blank, derived from the name", readOnlyOnEdit: false },
        { name: "description", label: "Description", type: "textarea", hint: "Shown under the topic on the blog." },
        { name: "sortOrder", label: "Sort order", type: "number", hint: "Low numbers come first in the filter." },
        { name: "active", label: "Active", type: "select",
          options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }],
          hint: "A hidden topic keeps its posts but drops out of the public filter." },
      ],
      fetchPage: clientPager(() => fetchAdminTopics(), ["name", "slug"]),
      create: (v) => createTopic(normalizeTopic(v)),
      update: (row, v) => updateTopic(row.id, normalizeTopic(v)),
      remove: (row) => deleteTopic(row.id),
    },
    team: {
      title: "Team", createLabel: "Create Member", idKey: "id",
      columns: [
        { key: "photoUrl", label: "Photo", width: "90px", render: (r) => <CoverThumb src={r.photoUrl} /> },
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "bio", label: "Subtitle" },
        { key: "sortOrder", label: "Order", width: "80px" },
      ],
      fields: [
        { name: "photoUrl", label: "Photo", type: "image", hint: "Square works best. PNG/JPG/WEBP/GIF, up to 5 MB." },
        { name: "name", label: "Name", required: true },
        { name: "role", label: "Role", placeholder: "e.g. Founder & CEO" },
        { name: "bio", label: "Subtitle", placeholder: "e.g. Software Engineer" },
        { name: "sortOrder", label: "Sort order", type: "number", hint: "Low numbers come first on the About page." },
      ],
      fetchPage: clientPager(() => api.get("/team/admin").then((r) => r.data), ["name", "role", "bio"]),
      create: (v) => {
        // One multipart request so the photo is stored with the member itself.
        const { photoUrlFile, photoUrlCleared, ...rest } = v;
        const fd = new FormData();
        fd.append("member", new Blob([JSON.stringify({
          name: rest.name,
          role: rest.role || null,
          bio: rest.bio || null,
          sortOrder: rest.sortOrder === "" || rest.sortOrder == null ? null : Number(rest.sortOrder),
        })], { type: "application/json" }));
        if (photoUrlFile) fd.append("image", photoUrlFile);
        return api.post("/team", fd);
      },
      update: async (row, v) => {
        const { photoUrlFile, photoUrlCleared, ...rest } = v;
        const fd = new FormData();
        fd.append("member", new Blob([JSON.stringify({
          name: rest.name,
          role: rest.role || null,
          bio: rest.bio || null,
          sortOrder: rest.sortOrder === "" || rest.sortOrder == null ? row.sortOrder : Number(rest.sortOrder),
        })], { type: "application/json" }));
        if (photoUrlFile) fd.append("image", photoUrlFile);
        await api.put(`/team/${row.id}`, fd);
        // Removing the photo is a separate call — PUT only ever sets one.
        if (!photoUrlFile && photoUrlCleared) await api.delete(`/team/${row.id}/photo`);
      },
      remove: (row) => api.delete(`/team/${row.id}`),
    },
    users: {
      title: "Users", idKey: "id",
      columns: [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role", render: (r) => (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: r.role === "ADMIN" ? "rgba(255,77,28,0.15)" : "rgba(148,163,184,0.15)", color: r.role === "ADMIN" ? "#ff4d1c" : "#94a3b8" }}>{r.role}</span>
        ) },
        { key: "emailVerified", label: "Verified", render: (r) => yn(r.emailVerified) },
      ],
      fields: [
        { name: "name", label: "Name", readOnlyOnEdit: true },
        { name: "email", label: "Email", readOnlyOnEdit: true },
        { name: "role", label: "Role", type: "select", required: true, options: [{ value: "USER", label: "USER" }, { value: "ADMIN", label: "ADMIN" }] },
      ],
      fetchPage: clientPager(() => api.get("/users").then((r) => r.data), ["name", "email", "role"]),
      update: (row, v) => api.put(`/users/${row.id}/role`, { role: v.role }),
      remove: (row) => api.delete(`/users/${row.id}`),
    },
  }), [lookups]);

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Backdrop for the mobile drawer */}
      {navOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/50 md:hidden"
          aria-hidden="true" onClick={() => setNavOpen(false)} />
      )}

      {/* Sidebar — a slide-over drawer below md, the static column from md up */}
      <aside id="admin-nav"
        className={`fixed left-0 top-16 bottom-0 z-40 w-56 shrink-0 overflow-y-auto border-r bg-background p-4 pt-16 transition-transform duration-200
          md:static md:z-auto md:translate-x-0 md:visible md:overflow-visible md:bg-transparent md:pt-4 md:transition-none ${
          navOpen ? "translate-x-0" : "-translate-x-full invisible"}`}
        style={{ borderColor: "hsl(var(--border))" }}>
        <p className="text-xs tracking-widest text-orange-500 font-mono mb-4 px-2">// ADMIN</p>
        {NAV.map((grp) => (
          <div key={grp.section} className="mb-5">
            <p className="text-[10px] uppercase tracking-wider opacity-40 px-2 mb-1">{grp.section}</p>
            {grp.items.map((it) => (
              <button key={it.key} onClick={() => { setActive(it.key); setManageCourse(null); setManageCategory(null); setNavOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  active === it.key ? "bg-orange-500 text-white" : "hover:bg-muted"}`}>
                <it.icon className="h-4 w-4" /> {it.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        <button type="button" onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={navOpen} aria-controls="admin-nav"
          className="md:hidden relative z-50 mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Menu
        </button>
        {active === "dashboard" && <Dashboard />}
        {active === "quizzes" && <QuizzesView />}
        {active === "pageContent" && <PageContent />}
        {active === "pageText" && <PageText />}
        {active === "blogModeration" && <BlogModeration />}
        {active === "courses" && manageCourse
          ? <CourseContent course={manageCourse} onBack={() => setManageCourse(null)} />
          : active === "categories" && manageCategory
          ? <ResourceCategoryContent category={manageCategory} onBack={() => setManageCategory(null)} />
          : (configs[active] && <ResourceView key={active} config={configs[active]} />)}
      </main>
    </div>
  );
}
