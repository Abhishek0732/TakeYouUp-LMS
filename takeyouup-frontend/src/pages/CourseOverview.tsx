import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock, FileText, Lock } from "lucide-react";
import { fetchCourseOverview, CourseNotFound } from "@/api/courses";
import CourseCover from "@/components/CourseCover";
import StateMessage from "@/components/StateMessage";
import { DetailSkeleton } from "@/components/Skeletons";
import useSeo from "@/hooks/useSeo";

/**
 * The public face of a course.
 *
 * Course URLs used to sit entirely behind ProtectedRoute, so a signed-out
 * visitor — and every crawler — was bounced to /login. On a learning platform
 * the courses are the content, so nothing worth finding was findable. This page
 * renders the syllabus anonymously: what the course covers, how it is
 * structured, how long it is. Reading a lesson still needs an account, which is
 * the usual arrangement on Coursera and Udemy.
 *
 * Signed-in visitors never see this — CourseEntry sends them straight to the
 * full CourseDetail view instead.
 */
const CourseOverview = ({ slug }: { slug: string }) => {
  const { data: course, isLoading, error } = useQuery({
    queryKey: ["courseOverview", slug],
    queryFn: () => fetchCourseOverview(slug),
    retry: (count, err) => !(err instanceof CourseNotFound) && count < 2,
    staleTime: 5 * 60_000,
  });

  const notFound = error instanceof CourseNotFound;

  useSeo({
    // A slug matching no course is this app's real 404 — `/:courseSlug` outranks
    // the catch-all route, so an unknown top-level URL lands here rather than on
    // NotFound. It must say so in the title and carry noindex, otherwise every
    // typo'd address becomes another indexable page.
    title: notFound ? "Page Not Found" : course?.title ?? "Course",
    description: notFound
      ? "This address doesn't match any course on TakeYouUp. Browse the catalogue to find what you were after."
      : course?.description ??
        "See what this course covers module by module before you sign up.",
    noindex: notFound,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <DetailSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <StateMessage
          headingAs="h1"
          title="Course not found"
          description="This address doesn't match any course. It may have been renamed or removed."
          icon={BookOpen}
          action={
            <Link to="/courses" className="btn-orange mt-5 mx-auto" style={{ borderRadius: 10, padding: "9px 16px", fontSize: 13 }}>
              Browse all courses
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <StateMessage
          tone="error"
          title="Couldn't load this course"
          description="Something went wrong reaching the catalogue."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // schema.org/Course, so a search result can show this as a course rather than
  // a generic page. Only fields we can actually vouch for.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description ?? undefined,
    provider: { "@type": "EducationalOrganization", name: "TakeYouUp" },
    educationalLevel: course.level ?? undefined,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.duration ?? undefined,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative py-14 overflow-hidden bg-dots" style={{ background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Link to="/courses" className="text-sm inline-flex items-center gap-1.5 mb-5" style={{ color: "hsl(var(--muted-foreground))", textDecoration: "none" }}>
            ← Back to Courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="section-tag">{course.category ?? "Course"}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
                {course.title}
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))", maxWidth: 640 }}>
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-5 mb-7" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                {course.level && <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {course.level}</span>}
                {course.duration && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>}
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {course.lessonCount} lessons in {course.moduleCount} {course.moduleCount === 1 ? "module" : "modules"}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/signup" className="btn-orange">
                  Start this course free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="btn-outline-dark" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  I already have an account
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
              <CourseCover src={course.image} title={course.title} className="w-full aspect-video object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>What you'll cover</h2>
        <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          The full syllabus. Sign in to open a lesson.
        </p>

        {course.modules.length === 0 ? (
          <StateMessage title="Lessons are on the way" description="This course doesn't have any published lessons yet." icon={FileText} />
        ) : (
          <div className="space-y-4" style={{ maxWidth: 820 }}>
            {course.modules.map((module, mIdx) => (
              <div key={mIdx} className="rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                <div className="flex items-center gap-3 px-5 py-4" style={{ background: "hsl(var(--muted))" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#ff4d1c" }}>
                    {String(mIdx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>{module.title}</h3>
                  <span className="ml-auto text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>
                    {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {module.lessons.map((lesson, lIdx) => (
                    <li
                      key={lIdx}
                      className="flex items-center gap-3 px-5 py-3"
                      style={{ borderTop: "1px solid hsl(var(--border))", fontSize: 14 }}
                    >
                      <Lock className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }} />
                      <span className="flex-1" style={{ minWidth: 0 }}>{lesson.title}</span>
                      {lesson.duration && (
                        <span className="text-xs flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>
                          {lesson.duration}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border p-8 text-center" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))", maxWidth: 820 }}>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Ready to start?</h2>
          <p className="text-sm mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Creating an account is free and takes a moment. Your progress is saved lesson by lesson.
          </p>
          <Link to="/signup" className="btn-orange mx-auto" style={{ width: "fit-content" }}>
            Create a free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
