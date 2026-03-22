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
} from "lucide-react";
import leetcodeLogo from "@/assets/leetcode-logo.png";
import gfgLogo from "@/assets/gfg-logo.png";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "@/services/questionService";

type Difficulty = "Easy" | "Medium" | "Hard";
type Platform = "LeetCode" | "GFG";
type Topic =
  | "Arrays" | "Strings" | "Linked List" | "Trees" | "Graphs"
  | "Dynamic Programming" | "Stack & Queue" | "Binary Search"
  | "Recursion" | "Hashing";

interface CodingQuestion {
  id: number;
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  url: string;
  topic: Topic;
}

const topics: Topic[] = [
  "Arrays", "Strings", "Linked List", "Trees", "Graphs",
  "Dynamic Programming", "Stack & Queue", "Binary Search", "Recursion", "Hashing",
];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const difficultyColor: Record<Difficulty, string> = {
  Easy:   "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard:   "bg-red-500/10 text-red-500 border-red-500/20",
};

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

  const questions: CodingQuestion[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleFilterChange = useCallback((setter: () => void) => {
    setter(); setCurrentPage(1);
  }, []);

  const counts = useMemo(() => ({
    Easy:   questions.filter((q) => q.difficulty === "Easy").length,
    Medium: questions.filter((q) => q.difficulty === "Medium").length,
    Hard:   questions.filter((q) => q.difficulty === "Hard").length,
  }), [questions]);

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

        {/* Difficulty stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
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
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${difficultyColor[d]}`}
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {counts[d]}
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
              {(["All", ...difficulties] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => handleFilterChange(() => setSelectedDifficulty(d as Difficulty | "All"))}
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

          {/* Row 2: topic filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {(["All Topics", ...topics] as const).map((t) => {
              const val = t === "All Topics" ? "All" : t as Topic;
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
            <span className="col-span-5">Title</span>
            <span className="col-span-2">Topic</span>
            <span className="col-span-2">Difficulty</span>
            <span className="col-span-2">Platform</span>
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
              return (
                <a
                  key={q.id}
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                      borderRadius: 12, padding: "10px 16px", transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,77,28,0.4)";
                      el.style.background = "hsl(var(--muted) / 0.4)";
                      el.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "hsl(var(--border))";
                      el.style.background = "hsl(var(--card))";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <span className="col-span-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                        {globalIndex + 1}
                      </span>
                      <span className="col-span-5 flex items-center gap-2 group-hover:text-orange-500 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
                        {q.title}
                        <ExternalLink style={{ width: 11, height: 11, opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100" />
                      </span>
                      <span className="col-span-2">
                        <span style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
                          {q.topic}
                        </span>
                      </span>
                      <span className="col-span-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${difficultyColor[q.difficulty]}`} style={{ fontFamily: "'DM Mono', monospace" }}>
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
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-start justify-between gap-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="group-hover:text-orange-500 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {q.title}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor[q.difficulty]}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                            {q.difficulty}
                          </span>
                          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>{q.topic}</span>
                        </div>
                      </div>
                      <img
                        src={q.platform === "LeetCode" ? leetcodeLogo : gfgLogo}
                        alt={q.platform}
                        style={{ width: 20, height: 20, borderRadius: 4, objectFit: "contain", flexShrink: 0 }}
                      />
                    </div>
                  </div>
                </a>
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

export default CodingQuestions;