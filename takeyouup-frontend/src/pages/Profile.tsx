import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award, BookOpen, Check, CheckCircle2, ChevronRight, Code2, Edit3, ExternalLink,
  GraduationCap, ListChecks, Loader2, LogOut, Mail, MailWarning, Save, Shield,
  Target, TrendingUp, X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiErrorMessage } from "@/api/errors";
import { resendVerification } from "@/api/auth";
import {
  fetchMe, fetchMyCertificates, fetchMyQuizAttempts,
  updateMyName, changeMyPassword,
  type CourseProgress, type Me,
} from "@/api/profile";
import CourseCover from "@/components/CourseCover";

const ORANGE = "#ff4d1c";
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PASSWORD_HINT = "At least 8 characters, including a letter and a number.";

type Tab = "overview" | "learning" | "certificates" | "settings";

const card: React.CSSProperties = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 16,
};

const Profile = () => {
  const { user, logout, login, emailVerified, setEmailVerified } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => { document.title = "My Profile | TakeYouUp"; }, []);
  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: !!user,
  });

  // Keep the sitewide banner honest if the profile says otherwise.
  useEffect(() => {
    if (me && me.emailVerified !== emailVerified) setEmailVerified(me.emailVerified);
  }, [me]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["me"] });

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "learning", label: "My Learning", icon: BookOpen },
    { key: "certificates", label: "Certificates", icon: Award },
    { key: "settings", label: "Settings", icon: Shield },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))" }}>
      <ProfileHeader
        me={me}
        fallbackName={user.name}
        fallbackEmail={user.email}
        onSaved={(name) => { login({ ...user, name }, me?.emailVerified); refresh(); }}
        onLogout={() => { logout(); navigate("/login"); }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <StatGrid me={me} loading={isLoading} />

        {/* Tabs — the underline lives on the wrapper so the scrolling row
            itself has nothing to overflow vertically. */}
        <div className="mb-6" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="flex gap-1 scroll-x">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 600,
                color: tab === t.key ? ORANGE : "hsl(var(--muted-foreground))",
                borderBottom: `2px solid ${tab === t.key ? ORANGE : "transparent"}`,
                marginBottom: -1,
              }}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
        </div>

        {isLoading && <Loading />}
        {!isLoading && tab === "overview" && <Overview me={me} onGo={() => setTab("learning")} />}
        {!isLoading && tab === "learning" && <Learning courses={me?.courses || []} />}
        {!isLoading && tab === "certificates" && <Certificates />}
        {!isLoading && tab === "settings" && <Settings me={me} onNameSaved={refresh} />}
      </div>
    </div>
  );
};

const Loading = () => (
  <div className="flex items-center justify-center gap-3 py-16" style={{ color: "hsl(var(--muted-foreground))" }}>
    <Loader2 className="h-5 w-5 animate-spin" /> Loading your progress…
  </div>
);

/* ─────────────────────────────── header ─────────────────────────────── */

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

function ProfileHeader({ me, fallbackName, fallbackEmail, onSaved, onLogout }: {
  me?: Me; fallbackName: string; fallbackEmail: string;
  onSaved: (name: string) => void; onLogout: () => void;
}) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me?.name ?? fallbackName);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setName(me?.name ?? fallbackName); }, [me?.name, fallbackName]);

  const displayName = me?.name ?? fallbackName;
  const email = me?.email ?? fallbackEmail;

  const save = async () => {
    if (!name.trim()) { toast({ title: "Name can't be empty", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await updateMyName(name.trim());
      onSaved(name.trim());
      toast({ title: "Profile updated" });
      setEditing(false);
    } catch (e) {
      toast({ title: "Update failed", description: apiErrorMessage(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const joined = me?.joinedAt
    ? new Date(me.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  return (
    <div className="bg-dots" style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--card))", position: "relative", overflow: "hidden" }}>
      {/* Soft brand glow instead of a solid colour band — same treatment the
          auth pages use, so the profile doesn't shout. */}
      <div className="pointer-events-none" style={{
        position: "absolute", top: -140, right: -80, width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,77,28,0.16), transparent 70%)", filter: "blur(70px)",
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 76, height: 76, borderRadius: 20,
              background: "linear-gradient(135deg, #ff4d1c, #ffb800)",
              color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26,
            }}
          >
            {initials(displayName)}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2 mb-1">
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
                  className="rounded-lg border px-3 py-1.5 text-lg font-bold bg-transparent"
                  style={{ fontFamily: "'Syne', sans-serif", maxWidth: 280 }} />
                <button onClick={save} disabled={saving} title="Save"
                  style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Save className="h-4 w-4" style={{ color: "#22c55e" }} />
                </button>
                <button onClick={() => { setEditing(false); setName(displayName); }} title="Cancel"
                  style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X className="h-4 w-4 opacity-60" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {displayName}
                </h1>
                <button onClick={() => setEditing(true)} title="Edit name"
                  style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Edit3 className="h-3.5 w-3.5 opacity-50 hover:opacity-90" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{email}</span>
              {me?.emailVerified
                ? <Pill color="#22c55e" icon={CheckCircle2}>Verified</Pill>
                : <Pill color="#ffb800" icon={MailWarning}>Unverified</Pill>}
              {me?.role === "ADMIN" && <Pill color={ORANGE} icon={Shield}>Admin</Pill>}
              {joined && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>Member since {joined}</span>}
            </div>
          </div>

          <div className="flex gap-2">
            {me?.role === "ADMIN" && (
              <Link to="/admin" className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))", textDecoration: "none" }}>
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={onLogout}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
              style={{ background: "transparent", cursor: "pointer", color: "#ef4444", borderColor: "rgba(239,68,68,0.35)" }}>
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Pill = ({ color, icon: Icon, children }: { color: string; icon: any; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
    style={{ background: `${color}1f`, color, fontFamily: "'DM Mono', monospace" }}>
    <Icon className="h-3 w-3" /> {children}
  </span>
);

/* ──────────────────────────────── stats ─────────────────────────────── */

function StatGrid({ me, loading }: { me?: Me; loading: boolean }) {
  const s = me?.stats;
  const cards = [
    { label: "Lessons completed", value: s?.lessonsCompleted ?? 0, icon: BookOpen, color: ORANGE, note: undefined as string | undefined },
    { label: "Problems solved", value: s ? `${s.problemsSolved}/${s.problemsTotal}` : "0", icon: Code2, color: "#22c55e", note: undefined },
    {
      label: "Quizzes taken", value: s?.quizzesTaken ?? 0, icon: ListChecks, color: "#3b82f6",
      note: s?.quizzesTaken ? `${s.averageQuizScore}% average` : undefined,
    },
    { label: "Certificates", value: s?.certificates ?? 0, icon: Award, color: "#ffb800", note: undefined },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-6">
      {cards.map((c) => (
        <div key={c.label} style={{ ...card, padding: "16px 18px" }}>
          <c.icon className="h-4 w-4 mb-3" style={{ color: c.color }} />
          <div className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            {loading ? "—" : c.value}
          </div>
          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{c.label}</div>
          {c.note && <div className="text-[11px] mt-0.5" style={{ color: c.color, fontFamily: "'DM Mono', monospace" }}>{c.note}</div>}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── overview ───────────────────────────── */

function Overview({ me, onGo }: { me?: Me; onGo: () => void }) {
  const current = me?.courses?.find((c) => c.percent < 100) ?? me?.courses?.[0];
  const s = me?.stats;
  const problemPct = s && s.problemsTotal ? Math.round((s.problemsSolved / s.problemsTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div style={{ ...card, padding: 20 }}>
          <SectionTitle icon={GraduationCap}>Continue learning</SectionTitle>
          {current ? <CourseRow course={current} /> : (
            <Empty text="You haven't started a course yet."
              action={<Link to="/courses" className="btn-orange" style={{ borderRadius: 10, textDecoration: "none" }}>Browse courses</Link>} />
          )}
          {me && me.courses.length > 1 && (
            <button onClick={onGo} className="mt-3 flex items-center gap-1 text-sm font-semibold"
              style={{ color: ORANGE, background: "none", border: "none", cursor: "pointer" }}>
              See all {me.courses.length} courses <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div style={{ ...card, padding: 20 }}>
          <SectionTitle icon={Target}>Practice problems</SectionTitle>
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {s?.problemsSolved ?? 0} of {s?.problemsTotal ?? 0} solved
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", color: ORANGE }}>{problemPct}%</span>
          </div>
          <Bar percent={problemPct} />
          <Link to="/problems" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: ORANGE, textDecoration: "none" }}>
            Go to problems <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div style={{ ...card, padding: 20 }}>
          <SectionTitle icon={TrendingUp}>At a glance</SectionTitle>
          <Row label="Courses in progress" value={s?.coursesInProgress ?? 0} />
          <Row label="Courses completed" value={s?.coursesCompleted ?? 0} />
          <Row label="Lessons completed" value={s?.lessonsCompleted ?? 0} />
          <Row label="Average quiz score" value={s?.quizzesTaken ? `${s.averageQuizScore}%` : "—"} />
          <Row label="Certificates earned" value={s?.certificates ?? 0} last />
        </div>

        <div style={{ ...card, padding: 20 }}>
          <SectionTitle icon={ListChecks}>Recent quizzes</SectionTitle>
          <RecentQuizzes />
        </div>
      </div>
    </div>
  );
}

const SectionTitle = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <h2 className="flex items-center gap-2 text-base font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
    <Icon className="h-4 w-4" style={{ color: ORANGE }} /> {children}
  </h2>
);

const Row = ({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) => (
  <div className="flex items-center justify-between py-2"
    style={{ borderBottom: last ? "none" : "1px solid hsl(var(--border))" }}>
    <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</span>
    <span className="font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{value}</span>
  </div>
);

const Bar = ({ percent, height = 8 }: { percent: number; height?: number }) => (
  <div style={{ height, borderRadius: 999, background: "hsl(var(--muted))", overflow: "hidden" }}>
    <div style={{
      width: `${percent}%`, height: "100%", borderRadius: 999,
      background: percent >= 100 ? "#22c55e" : "linear-gradient(90deg, #ff4d1c, #ffb800)",
      transition: "width 0.4s ease",
    }} />
  </div>
);

const Empty = ({ text, action }: { text: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-3 py-8 text-center">
    <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{text}</p>
    {action}
  </div>
);

/* ─────────────────────────────── learning ───────────────────────────── */

function CourseRow({ course }: { course: CourseProgress }) {
  const done = course.percent >= 100;
  const target = course.nextLessonSlug ? `/${course.slug}/${course.nextLessonSlug}` : `/${course.slug}`;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link to={target} className="flex-shrink-0" style={{ textDecoration: "none" }}>
        <CourseCover src={course.image} title={course.title}
          className="rounded-xl object-cover" style={{ width: 120, height: 72 }} />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{course.title}</h3>
          {done && <Pill color="#22c55e" icon={Check}>Completed</Pill>}
        </div>
        <p className="text-xs mb-2" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>
          {course.completedLessons}/{course.totalLessons} lessons · {course.percent}%
          {course.level && ` · ${course.level}`}
        </p>
        <Bar percent={course.percent} height={6} />
        {!done && course.nextLessonTitle && (
          <p className="text-xs mt-2 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
            Up next: <span style={{ color: "hsl(var(--foreground))" }}>{course.nextLessonTitle}</span>
          </p>
        )}
      </div>

      <div className="flex sm:items-center">
        <Link to={target} className="btn-orange whitespace-nowrap" style={{ borderRadius: 10, textDecoration: "none" }}>
          {done ? "Review" : "Continue"} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Learning({ courses }: { courses: CourseProgress[] }) {
  if (!courses.length) {
    return (
      <div style={{ ...card, padding: 20 }}>
        <Empty text="Your courses appear here once you complete your first lesson."
          action={<Link to="/courses" className="btn-orange" style={{ borderRadius: 10, textDecoration: "none" }}>Browse courses</Link>} />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {courses.map((c) => (
        <div key={c.id} style={{ ...card, padding: 18 }}>
          <CourseRow course={c} />
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── certificates ─────────────────────────── */

function Certificates() {
  const { data: certs, isLoading } = useQuery({
    queryKey: ["myCertificates"],
    queryFn: fetchMyCertificates,
  });

  if (isLoading) return <Loading />;

  if (!certs?.length) {
    return (
      <div style={{ ...card, padding: 20 }}>
        <Empty text="Finish every lesson in a course to earn your first certificate."
          action={<Link to="/courses" className="btn-orange" style={{ borderRadius: 10, textDecoration: "none" }}>Browse courses</Link>} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {certs.map((c) => (
        <div key={c.serialNo} style={{ ...card, padding: 20 }}>
          <div className="flex items-start gap-3">
            <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: "rgba(255,184,0,0.14)" }}>
              <Award className="h-5 w-5" style={{ color: "#ffb800" }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{c.courseTitle}</h3>
              <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                Issued {new Date(c.issuedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="text-[11px] mt-2 truncate" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
                {c.serialNo}
              </p>
              <Link to="/certificates" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: ORANGE, textDecoration: "none" }}>
                View &amp; share <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentQuizzes() {
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["myQuizAttempts"],
    queryFn: fetchMyQuizAttempts,
  });

  if (isLoading) {
    return <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Loading…</p>;
  }
  if (!attempts?.length) {
    return <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No quiz attempts yet.</p>;
  }

  return (
    <div className="space-y-2">
      {attempts.slice(0, 5).map((a) => {
        const good = a.percent >= 70;
        return (
          <div key={a.id} className="flex items-center justify-between gap-2">
            <span className="text-sm truncate" title={a.quizTitle}>{a.quizTitle}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                fontFamily: "'DM Mono', monospace",
                background: good ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)",
                color: good ? "#22c55e" : "#ef4444",
              }}>
              {a.score}/{a.total}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────── settings ───────────────────────────── */

function Settings({ me, onNameSaved }: { me?: Me; onNameSaved: () => void }) {
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(me?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState("");

  const [resending, setResending] = useState(false);

  useEffect(() => { setName(me?.name ?? ""); }, [me?.name]);

  const input = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";

  const saveName = async () => {
    if (!name.trim()) { toast({ title: "Name can't be empty", variant: "destructive" }); return; }
    setSavingName(true);
    try {
      await updateMyName(name.trim());
      if (user) login({ ...user, name: name.trim() }, me?.emailVerified);
      onNameSaved();
      toast({ title: "Name updated" });
    } catch (e) {
      toast({ title: "Update failed", description: apiErrorMessage(e), variant: "destructive" });
    } finally { setSavingName(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (!PASSWORD_RULE.test(next)) { setPwError(PASSWORD_HINT); return; }
    if (next !== confirm) { setPwError("The two new passwords don't match."); return; }

    setSavingPw(true);
    try {
      await changeMyPassword(current, next);
      toast({ title: "Password updated", description: "Use your new password next time you sign in." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (e) {
      setPwError(apiErrorMessage(e, "Could not change the password."));
    } finally { setSavingPw(false); }
  };

  const resend = async () => {
    if (!me) return;
    setResending(true);
    try {
      await resendVerification(me.email);
      toast({ title: "Verification email sent", description: "Check your inbox for the link." });
    } finally { setResending(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div style={{ ...card, padding: 20 }}>
        <SectionTitle icon={Edit3}>Account details</SectionTitle>

        <label className="block text-xs opacity-70 mb-1">Display name</label>
        <input className={input + " mb-3"} value={name} onChange={(e) => setName(e.target.value)} />

        <label className="block text-xs opacity-70 mb-1">Email</label>
        <input className={input + " mb-1 opacity-60"} value={me?.email ?? ""} disabled />
        <p className="text-[11px] mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
          Your email is your sign-in identity and can't be changed here.
        </p>

        <button onClick={saveName} disabled={savingName}
          className="btn-orange" style={{ borderRadius: 10, opacity: savingName ? 0.7 : 1 }}>
          <Save className="h-4 w-4" /> {savingName ? "Saving…" : "Save changes"}
        </button>

        <div className="mt-6 pt-5" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">Email verification</span>
            {me?.emailVerified
              ? <Pill color="#22c55e" icon={CheckCircle2}>Verified</Pill>
              : <Pill color="#ffb800" icon={MailWarning}>Pending</Pill>}
          </div>
          {me?.emailVerified ? (
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Your address is confirmed — nothing to do here.
            </p>
          ) : (
            <>
              <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                Confirm your address to secure the account and enable password recovery.
              </p>
              <button onClick={resend} disabled={resending}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
                style={{ background: "transparent", cursor: "pointer", color: "hsl(var(--foreground))" }}>
                <Mail className="h-4 w-4" /> {resending ? "Sending…" : "Resend verification email"}
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ ...card, padding: 20 }}>
        <SectionTitle icon={Shield}>Change password</SectionTitle>
        <form onSubmit={savePassword} className="space-y-3">
          <div>
            <label className="block text-xs opacity-70 mb-1">Current password</label>
            <input type="password" className={input} value={current} required
              onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs opacity-70 mb-1">New password</label>
            <input type="password" className={input} value={next} required
              onChange={(e) => setNext(e.target.value)} />
            <p className="mt-1 text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>{PASSWORD_HINT}</p>
          </div>
          <div>
            <label className="block text-xs opacity-70 mb-1">Confirm new password</label>
            <input type="password" className={input} value={confirm} required
              onChange={(e) => setConfirm(e.target.value)} />
          </div>

          {pwError && <p className="text-xs" style={{ color: "#ef4444" }}>{pwError}</p>}

          <button type="submit" disabled={savingPw}
            className="btn-orange" style={{ borderRadius: 10, opacity: savingPw ? 0.7 : 1 }}>
            {savingPw ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
