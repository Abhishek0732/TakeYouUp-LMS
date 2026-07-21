import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Flame,
  CalendarDays,
  ArrowUpRight,
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  Circle,
} from "lucide-react";
import leetcodeLogo from "@/assets/leetcode-logo.png";
import gfgLogo from "@/assets/gfg-logo.png";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchQuestions,
  fetchTopics,
  fetchDifficulties,
  fetchQuestionStats,
  fetchQuestionProgress,
  type QuestionProgress,
} from "@/services/questionService";
import { useProgress } from "@/context/ProgressContext";

/** Topics, difficulties and platforms all come from the DB — never hardcode them. */
type Difficulty = string;
type Platform = string;
type Topic = string;

interface CodingQuestion {
  id: number;
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  url: string;
  topic: Topic;
}

/** Only used until /api/difficulties responds, so the cards don't pop in empty. */
const FALLBACK_DIFFICULTIES = ["Easy", "Medium", "Hard"];

const DIFFICULTY_STYLES: Record<string, string> = {
  easy:   "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard:   "bg-red-500/10 text-red-500 border-red-500/20",
};
const difficultyClass = (d: string) =>
  DIFFICULTY_STYLES[(d || "").toLowerCase()] ?? "bg-muted text-muted-foreground border-border";

const DIFFICULTY_ACCENTS: Record<string, string> = {
  easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444",
};
const difficultyAccent = (d: string) =>
  DIFFICULTY_ACCENTS[(d || "").toLowerCase()] ?? "#94a3b8";

/* ── POTD platform configs ── */
const potdPlatforms = [
  {
    key: "leetcode",
    name: "LeetCode",
    tagline: "Problem of the Day",
    potdUrl: "https://leetcode.com/problemset/",
    color: "#FFA116",
    colorLight: "rgba(255,161,22,0.1)",
    colorBorder: "rgba(255,161,22,0.28)",
    logo: leetcodeLogo,
    stats: "2,700+ problems",
    Icon: Trophy,
  },
  {
    key: "gfg",
    name: "GeeksforGeeks",
    tagline: "Problem of the Day",
    potdUrl: "https://www.geeksforgeeks.org/problem-of-the-day",
    color: "#2F8D46",
    colorLight: "rgba(47,141,70,0.1)",
    colorBorder: "rgba(47,141,70,0.28)",
    logo: gfgLogo,
    stats: "3,000+ problems",
    Icon: Zap,
  },
  {
    key: "code360",
    name: "Code360",
    tagline: "Problem of the Day",
    potdUrl: "https://www.naukri.com/code360/problem-of-the-day",
    color: "#FF6B35",
    colorLight: "rgba(255,107,53,0.1)",
    colorBorder: "rgba(255,107,53,0.28)",
    logo: null,
    logoText: "360",
    stats: "Curated sets",
    Icon: Target,
  },
] as const;

function getTodayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/* pagination button base style */
const paginationBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  border: "1.5px solid hsl(var(--border))",
  background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace",
  transition: "all 0.15s",
};

/* ═══════════════════════════════════════ */
const CodingQuestions = () => {
  useEffect(() => {
    document.title = "Problems | TakeYouUp - Master Programming & Build Your Future";
  }, []);

  const [selectedTopic, setSelectedTopic] = useState<Topic | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: [
      "questions", currentPage, itemsPerPage,
      selectedTopic === "All" ? null : selectedTopic,
      selectedDifficulty === "All" ? null : selectedDifficulty,
      searchQuery,
    ],
    queryFn: () =>
      fetchQuestions({
        page: currentPage - 1, size: itemsPerPage,
        topic: selectedTopic === "All" ? undefined : selectedTopic,
        difficulty: selectedDifficulty === "All" ? undefined : selectedDifficulty,
        search: searchQuery,
      }),
    keepPreviousData: true,
  });

  // Topics and difficulties are catalogue data — whatever an admin adds shows up
  // here without a redeploy. Cached for the session; they change rarely.
  const { data: topicsData } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
    staleTime: 5 * 60 * 1000,
  });
  const { data: difficultiesData } = useQuery({
    queryKey: ["difficulties"],
    queryFn: fetchDifficulties,
    staleTime: 5 * 60 * 1000,
  });
  const topics: Topic[] = topicsData ?? [];
  const difficulties: Difficulty[] = difficultiesData ?? FALLBACK_DIFFICULTIES;

  // Counts across the whole filtered set — the page only holds 10 rows, so
  // counting `questions` here would just report the current page.
  const { data: statsData } = useQuery({
    queryKey: ["questionStats", selectedTopic === "All" ? null : selectedTopic, searchQuery],
    queryFn: () => fetchQuestionStats({
      topic: selectedTopic === "All" ? undefined : selectedTopic,
      search: searchQuery,
    }),
  });

  const { data: progress } = useQuery({
    queryKey: ["questionProgress"],
    queryFn: fetchQuestionProgress,
  });

  const questions: CodingQuestion[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleFilterChange = useCallback((setter: () => void) => {
    setter(); setCurrentPage(1);
  }, []);

  const counts = statsData ?? {};

  // ---- solved tracking ----
  const queryClient = useQueryClient();
  const { isCompleted, toggleProgress } = useProgress();

  const toggleSolved = useCallback(async (questionId: number) => {
    await toggleProgress("QUESTION", String(questionId));
    // The summary lives on the server; refresh it once the toggle lands.
    queryClient.invalidateQueries({ queryKey: ["questionProgress"] });
  }, [toggleProgress, queryClient]);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalElements);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))" }}>

      {/* ══════════════ HERO + POTD ══════════════ */}
      <section
        style={{
          background: "hsl(var(--background))",
          borderBottom: "1px solid hsl(var(--border))",
          padding: "44px 0 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ambient blob */}
        <div
          className="animate-blob"
          style={{
            position: "absolute", top: -80, right: -60, width: 420, height: 420,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(255,77,28,0.1), transparent 70%)",
            filter: "blur(72px)", pointerEvents: "none",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          {/* page title row */}
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8 animate-fade-up">
            <div>
              <div className="section-tag">Daily Practice</div>
              <h1
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                Coding <span className="gradient-text">Problems</span>
              </h1>
            </div>
            <span
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "hsl(var(--muted-foreground))", display: "flex", alignItems: "center", gap: 6, paddingBottom: 4 }}
            >
              <CalendarDays style={{ width: 13, height: 13 }} />
              {getTodayString()}
            </span>
          </div>

          {/* POTD section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Flame style={{ width: 16, height: 16, color: "#ff4d1c" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
              Problem of the Day
            </span>
            <span
              className="pill-orange"
              style={{ fontSize: 10, padding: "3px 10px" }}
            >
              Build your streak 🔥
            </span>
          </div>

          {/* POTD cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {potdPlatforms.map((p) => {
              const Icon = p.Icon;
              return (
                <a
                  key={p.key}
                  href={p.potdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "hsl(var(--card))",
                      border: `1.5px solid ${p.colorBorder}`,
                      borderRadius: 18,
                      padding: "18px 20px",
                      transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-4px)";
                      el.style.boxShadow = `0 16px 40px ${p.colorLight}`;
                      el.style.borderColor = p.color;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "none";
                      el.style.borderColor = p.colorBorder;
                    }}
                  >
                    {/* Top: logo + arrow */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* logo / fallback */}
                        {p.logo ? (
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "hsl(var(--muted))", display: "flex", alignItems: "center", justifyContent: "center", padding: 5 }}>
                            <img src={p.logo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          </div>
                        ) : (
                          <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: p.colorLight, border: `1.5px solid ${p.colorBorder}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13,
                            color: p.color, letterSpacing: "-0.02em",
                          }}>
                            {(p as any).logoText}
                          </div>
                        )}
                        <div>
                          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.2 }}>{p.name}</p>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{p.stats}</p>
                        </div>
                      </div>
                      <ArrowUpRight
                        style={{ width: 16, height: 16, color: p.color, flexShrink: 0, transition: "transform 0.2s" }}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    {/* Bottom: badge + solve link */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 999,
                        background: p.colorLight, border: `1px solid ${p.colorBorder}`,
                        fontSize: 11, fontWeight: 600, color: p.color,
                        fontFamily: "'DM Mono', monospace",
                      }}>
                        <Icon style={{ width: 11, height: 11 }} />
                        {p.tagline}
                      </div>
                      <span
                        style={{ fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: p.color, transition: "text-decoration 0.15s" }}
                        className="group-hover:underline"
                      >
                        Solve now →
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ PROBLEMS TABLE ══════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Your progress */}
        <ProgressTracker progress={progress} />

        {/* Difficulty stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12, marginBottom: 20 }}>
          {difficulties.map((d) => (
            <div
              key={d}
              style={{
                background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                borderRadius: 12, padding: "10px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>{d}</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${difficultyClass(d)}`}
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {counts[d] ?? 0}
              </span>
            </div>
          ))}
        </div>

        {/* Filters card */}
        <div
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, padding: "16px", marginBottom: 20 }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Filter style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
              {["All", ...difficulties].map((d) => (
                <button
                  key={d}
                  onClick={() => handleFilterChange(() => setSelectedDifficulty(d))}
                  style={{
                    padding: "6px 14px", borderRadius: 999, fontSize: 12,
                    fontFamily: "'Syne', sans-serif", fontWeight: 600,
                    border: "none", cursor: "pointer", transition: "all 0.15s",
                    background: selectedDifficulty === d ? "#ff4d1c" : "hsl(var(--muted))",
                    color: selectedDifficulty === d ? "white" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {d === "All" ? "All" : d}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative", width: "100%", maxWidth: 240 }}>
              <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "hsl(var(--muted-foreground))" }} />
              <input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{
                  width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  borderRadius: 9, border: "1.5px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: "inherit", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; }}
                onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; }}
              />
            </div>
          </div>

          {/* Row 2: topic filters — sourced from /api/topics */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {["All Topics", ...topics].map((t) => {
              const val = t === "All Topics" ? "All" : t;
              const active = selectedTopic === val;
              return (
                <button
                  key={t}
                  onClick={() => handleFilterChange(() => setSelectedTopic(val))}
                  style={{
                    padding: "5px 12px", borderRadius: 999, fontSize: 12,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    border: "1.5px solid",
                    cursor: "pointer", transition: "all 0.15s",
                    background: active ? "rgba(255,77,28,0.08)" : "transparent",
                    borderColor: active ? "#ff4d1c" : "hsl(var(--border))",
                    color: active ? "#ff4d1c" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table column headers */}
        {totalElements > 0 && (
          <div
            className="hidden md:grid grid-cols-12 gap-4 px-4 mb-2"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "hsl(var(--muted-foreground))" }}
          >
            <span className="col-span-1">#</span>
            <span className="col-span-4">Title</span>
            <span className="col-span-2">Topic</span>
            <span className="col-span-2">Difficulty</span>
            <span className="col-span-2">Platform</span>
            <span className="col-span-1 text-right">Solved</span>
          </div>
        )}

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} style={{ height: 48, borderRadius: 12, background: "hsl(var(--muted))", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))
          ) : totalElements === 0 ? (
            <div style={{ borderRadius: 18, padding: "64px 24px", textAlign: "center", background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <p style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Sans', sans-serif" }}>No questions found for the selected filters.</p>
            </div>
          ) : (
            questions.map((q, i) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + i;
              const solved = isCompleted("QUESTION", String(q.id));
              return (
                <div key={q.id} className="group">
                  <div
                    style={{
                      background: solved ? "rgba(34,197,94,0.06)" : "hsl(var(--card))",
                      border: `1px solid ${solved ? "rgba(34,197,94,0.28)" : "hsl(var(--border))"}`,
                      borderRadius: 12, padding: "10px 16px", transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,77,28,0.4)";
                      el.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = solved ? "rgba(34,197,94,0.28)" : "hsl(var(--border))";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <span className="col-span-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                        {globalIndex + 1}
                      </span>
                      <a
                        href={q.url} target="_blank" rel="noopener noreferrer"
                        className="col-span-4 flex items-center gap-2 hover:text-orange-500 transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none", color: "inherit" }}
                      >
                        {q.title}
                        <ExternalLink style={{ width: 11, height: 11, opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100" />
                      </a>
                      <span className="col-span-2">
                        <span style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
                          {q.topic}
                        </span>
                      </span>
                      <span className="col-span-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${difficultyClass(q.difficulty)}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                          {q.difficulty}
                        </span>
                      </span>
                      <span className="col-span-2 flex items-center gap-2">
                        {q.platform === "LeetCode"
                          ? <img src={leetcodeLogo} alt="LeetCode" style={{ width: 18, height: 18, borderRadius: 4, objectFit: "contain" }} />
                          : <img src={gfgLogo} alt="GFG" style={{ width: 18, height: 18, borderRadius: 4, objectFit: "contain" }} />
                        }
                        <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>{q.platform}</span>
                      </span>
                      <span className="col-span-1 flex justify-end">
                        <SolvedToggle solved={solved} onToggle={() => toggleSolved(q.id)} />
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-start justify-between gap-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <a
                          href={q.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none", color: "inherit" }}
                        >
                          {q.title}
                        </a>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyClass(q.difficulty)}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                            {q.difficulty}
                          </span>
                          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>{q.topic}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <img
                          src={q.platform === "LeetCode" ? leetcodeLogo : gfgLogo}
                          alt={q.platform}
                          style={{ width: 20, height: 20, borderRadius: 4, objectFit: "contain" }}
                        />
                        <SolvedToggle solved={solved} onToggle={() => toggleSolved(q.id)} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalElements > 0 && (
          <div
            style={{
              marginTop: 20, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
              borderRadius: 16, padding: "14px 16px",
              display: "flex", flexDirection: "row", flexWrap: "wrap",
              alignItems: "center", justifyContent: "space-between", gap: 12,
            }}
          >
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
              Showing {startItem}–{endItem} of {totalElements}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} style={{ ...paginationBtnStyle, opacity: currentPage === 1 ? 0.3 : 1 }}>
                <ChevronsLeft style={{ width: 13, height: 13 }} />
              </button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} style={{ ...paginationBtnStyle, opacity: currentPage === 1 ? 0.3 : 1 }}>
                <ChevronLeft style={{ width: 13, height: 13 }} />
              </button>
              {pageNumbers.map((page, idx) =>
                page === "..." ? (
                  <span key={idx} style={{ padding: "0 4px", fontSize: 13, color: "hsl(var(--muted-foreground))" }}>…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    style={{
                      ...paginationBtnStyle,
                      background: currentPage === page ? "#ff4d1c" : "hsl(var(--muted))",
                      color: currentPage === page ? "white" : "hsl(var(--muted-foreground))",
                      borderColor: currentPage === page ? "#ff4d1c" : "hsl(var(--border))",
                      fontWeight: currentPage === page ? 700 : 400,
                    }}
                  >
                    {page}
                  </button>
                )
              )}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} style={{ ...paginationBtnStyle, opacity: currentPage === totalPages ? 0.3 : 1 }}>
                <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} style={{ ...paginationBtnStyle, opacity: currentPage === totalPages ? 0.3 : 1 }}>
                <ChevronsRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════ progress tracker ═══════════════ */
function ProgressTracker({ progress }: { progress?: QuestionProgress }) {
  if (!progress || progress.total === 0) return null;

  const { solved, total, percent, byDifficulty } = progress;
  const levels = Object.entries(byDifficulty || {});

  return (
    <div
      style={{
        background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
        borderRadius: 16, padding: "18px 20px", marginBottom: 20,
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff4d1c", marginBottom: 4 }}>
            Your progress
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.35rem" }}>
            {solved} <span style={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>of {total} solved</span>
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: percent === 100 ? "#22c55e" : "#ff4d1c" }}>
          {percent}%
        </div>
      </div>

      {/* overall bar */}
      <div style={{ height: 8, borderRadius: 999, background: "hsl(var(--muted))", overflow: "hidden", marginBottom: 14 }}>
        <div
          style={{
            width: `${percent}%`, height: "100%", borderRadius: 999,
            background: "linear-gradient(90deg, #ff4d1c, #ffb800)",
            transition: "width 0.35s ease",
          }}
        />
      </div>

      {/* per-difficulty bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>
        {levels.map(([level, bucket]) => {
          const pct = bucket.total === 0 ? 0 : Math.round((bucket.solved / bucket.total) * 100);
          const accent = difficultyAccent(level);
          return (
            <div key={level}>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", fontFamily: "'DM Sans', sans-serif" }}>{level}</span>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: accent }}>
                  {bucket.solved}/{bucket.total}
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "hsl(var(--muted))", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: accent, transition: "width 0.35s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {solved === 0 && (
        <p style={{ marginTop: 12, fontSize: 12, color: "hsl(var(--muted-foreground))", fontFamily: "'DM Sans', sans-serif" }}>
          Mark a problem solved with the circle on the right of each row to start tracking.
        </p>
      )}
    </div>
  );
}

/* ═══════════════ solved toggle ═══════════════ */
function SolvedToggle({ solved, onToggle }: { solved: boolean; onToggle: () => void }) {
  const [busy, setBusy] = useState(false);

  const click = async (e: React.MouseEvent) => {
    // The row links to the problem — don't follow it when ticking the box.
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try { await onToggle(); } finally { setBusy(false); }
  };

  return (
    <button
      type="button"
      onClick={click}
      disabled={busy}
      title={solved ? "Mark as unsolved" : "Mark as solved"}
      aria-pressed={solved}
      style={{
        background: "transparent", border: "none", cursor: busy ? "wait" : "pointer",
        padding: 2, display: "flex", alignItems: "center", opacity: busy ? 0.5 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {solved
        ? <CheckCircle2 style={{ width: 19, height: 19, color: "#22c55e" }} />
        : <Circle style={{ width: 19, height: 19, color: "hsl(var(--muted-foreground))", opacity: 0.5 }} />}
    </button>
  );
}

export default CodingQuestions;