import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, X } from "lucide-react";
import { useResume } from "@/hooks/useResume";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionProgress } from "@/services/questionService";
import CourseCover from "@/components/CourseCover";

const DISMISS_KEY = "resumeCardDismissed";

/**
 * Floating "carry on" card for returning learners.
 *
 * Deliberately not a band across the top of the page: the landing page's job is
 * to explain the product to someone who has never seen it, and pushing the hero
 * below the fold costs that for everyone. This sits out of the way instead —
 * bottom-left, because the chatbot owns bottom-right — slides in after the hero
 * has had a moment, and stays dismissed for the rest of the session.
 */
const ContinueLearning = () => {
  const { signedIn, course, target } = useResume();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === "true"
  );

  const { data: problems } = useQuery({
    queryKey: ["questionProgress"],
    queryFn: fetchQuestionProgress,
    enabled: signedIn,
    staleTime: 60_000,
  });

  // Let the hero land first — appearing instantly reads as an interruption.
  useEffect(() => {
    if (!signedIn || !course || dismissed) return;
    const t = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, [signedIn, course, dismissed]);

  if (!signedIn || !course || dismissed) return null;

  const streak = problems?.streak?.current ?? 0;

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <div
      className="hidden sm:block fixed z-40"
      style={{
        left: 24,
        bottom: 24,
        width: 340,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease, transform 0.35s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <p
            className="text-[10px] tracking-widest font-mono"
            style={{ color: "#ff4d1c" }}
          >
            // PICK UP WHERE YOU LEFT OFF
          </p>
          <button
            onClick={close}
            title="Dismiss"
            aria-label="Dismiss"
            style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 0 }}
          >
            <X className="h-3.5 w-3.5 opacity-50 hover:opacity-90" />
          </button>
        </div>

        <div className="flex gap-3">
          <CourseCover
            src={course.image}
            title={course.title}
            className="rounded-lg object-cover flex-shrink-0"
            style={{ width: 64, height: 44 }}
          />
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm font-bold truncate"
              style={{ fontFamily: "'Syne', sans-serif" }}
              title={course.title}
            >
              {course.title}
            </h3>
            <p
              className="text-[11px] mb-1.5"
              style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}
            >
              {course.completedLessons}/{course.totalLessons} · {course.percent}%
              {streak > 0 && (
                <span style={{ color: "#ff4d1c" }}> · {streak}d streak</span>
              )}
            </p>
            <div style={{ height: 4, borderRadius: 999, background: "hsl(var(--muted))", overflow: "hidden" }}>
              <div
                style={{
                  width: `${course.percent}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #ff4d1c, #ffb800)",
                }}
              />
            </div>
          </div>
        </div>

        {course.nextLessonTitle && (
          <p className="text-[11px] mt-2.5 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
            Up next: <span style={{ color: "hsl(var(--foreground))" }}>{course.nextLessonTitle}</span>
          </p>
        )}

        <Link
          to={target}
          onClick={close}
          className="btn-orange w-full justify-center mt-3"
          style={{ borderRadius: 10, textDecoration: "none", padding: "9px 14px", fontSize: 13 }}
        >
          Continue <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ContinueLearning;
