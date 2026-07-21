import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Flame, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMe } from "@/api/profile";
import { fetchQuestionProgress } from "@/services/questionService";
import CourseCover from "@/components/CourseCover";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Returning-learner band, shown above the marketing hero once signed in.
 *
 * A landing page that greets a logged-in student with "Join 5,000+ learners"
 * wastes the most valuable slot on the site. Every LMS worth copying puts
 * "pick up where you left off" first, so the common case — coming back to
 * continue — is one click instead of a hunt through the course list.
 */
const ContinueLearning = () => {
  const { user, ready } = useAuth();

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: ready && !!user,
  });

  const { data: problems } = useQuery({
    queryKey: ["questionProgress"],
    queryFn: fetchQuestionProgress,
    enabled: ready && !!user,
  });

  if (!ready || !user) return null;

  const course = me?.courses?.find((c) => c.percent < 100) ?? me?.courses?.[0];
  const streak = problems?.streak?.current ?? 0;

  return (
    <section style={{ background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs tracking-widest font-mono" style={{ color: "#ff4d1c" }}>
              // WELCOME BACK
            </p>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              {user.name?.split(" ")[0]}, pick up where you left off
            </h2>
          </div>

          <div className="flex items-center gap-5 text-sm">
            {streak > 0 && (
              <span className="flex items-center gap-1.5" style={{ color: "#ff4d1c" }}>
                <Flame className="h-4 w-4" />
                <strong>{streak}</strong>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>day streak</span>
              </span>
            )}
            {me && me.stats.certificates > 0 && (
              <span className="flex items-center gap-1.5" style={{ color: "#ffb800" }}>
                <Trophy className="h-4 w-4" />
                <strong>{me.stats.certificates}</strong>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>
                  certificate{me.stats.certificates === 1 ? "" : "s"}
                </span>
              </span>
            )}
            <Link to="/profile" className="font-semibold hover:underline"
              style={{ color: "#ff4d1c", textDecoration: "none" }}>
              My progress →
            </Link>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-2xl" />
        ) : course ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-2xl border p-4">
            <CourseCover src={course.image} title={course.title}
              className="rounded-xl object-cover flex-shrink-0"
              style={{ width: 128, height: 76 }} />

            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                {course.title}
              </h3>
              <p className="text-xs mb-2" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>
                {course.completedLessons}/{course.totalLessons} lessons · {course.percent}%
              </p>
              <div style={{ height: 6, borderRadius: 999, background: "hsl(var(--muted))", overflow: "hidden" }}>
                <div style={{
                  width: `${course.percent}%`, height: "100%", borderRadius: 999,
                  background: "linear-gradient(90deg, #ff4d1c, #ffb800)",
                }} />
              </div>
              {course.nextLessonTitle && (
                <p className="text-xs mt-2 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Up next: <span style={{ color: "hsl(var(--foreground))" }}>{course.nextLessonTitle}</span>
                </p>
              )}
            </div>

            <Link
              to={course.nextLessonSlug ? `/${course.slug}/${course.nextLessonSlug}` : `/${course.slug}`}
              className="btn-orange whitespace-nowrap justify-center"
              style={{ borderRadius: 12, textDecoration: "none" }}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5" style={{ color: "#ff4d1c" }} />
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                You haven't started a course yet — the first lesson takes about ten minutes.
              </p>
            </div>
            <Link to="/courses" className="btn-orange whitespace-nowrap"
              style={{ borderRadius: 12, textDecoration: "none" }}>
              Browse courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContinueLearning;
