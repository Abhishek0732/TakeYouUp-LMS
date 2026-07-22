import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen, Search, SlidersHorizontal, AlertCircle } from "lucide-react";
import { useCourses } from "@/context/CourseContext";
import CourseCover from "@/components/CourseCover";
import { CardGridSkeleton, ChipsSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";

const Courses = () => {
  useEffect(() => {
    document.title = "Courses | TakeYouUp - Master Programming & Build Your Future";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const revealRef = useRef<HTMLDivElement>(null);
  const { courses, loading, error, refetch } = useCourses();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const els = revealRef.current?.querySelectorAll(".reveal:not(.in-view)") ?? [];
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } }),
        { threshold: 0.05 }
      );
      els.forEach((el) => obs.observe(el));
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedCategory, courses]);


  const courseList = Array.isArray(courses) ? courses : [];
  const allCourses = courseList;
  const categories = ["All", ...Array.from(new Set(allCourses.map((c: any) => c.category)))];
  const filteredCourses = selectedCategory === "All" ? allCourses : allCourses.filter((c: any) => c.category === selectedCategory);

  const levelPill = (level: string) => {
    if (level === "Beginner") return "pill-green";
    if (level === "Intermediate") return "pill-gold";
    return "pill-orange";
  };

  return (
    <div ref={revealRef} style={{ minHeight: "100vh" }}>
      {/* Hero header */}
      <section
        className="relative py-20 overflow-hidden bg-dots"
        style={{ background: "hsl(var(--background))" }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 animate-blob"
          style={{ background: "radial-gradient(circle, #ff4d1c 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl animate-fade-up">
            <div className="section-tag">Our Curriculum</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              Explore <span className="gradient-text">Courses</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              Comprehensive courses designed to take you from beginner to expert.
              Learn at your own pace with hands-on projects.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filter bar */}
        {loading ? (
          <div className="mb-10">
            <ChipsSkeleton count={5} />
          </div>
        ) : (
        <div className="flex items-center gap-3 mb-10 scroll-x pb-2 reveal in-view">
          <SlidersHorizontal className="h-4 w-4 flex-shrink-0 opacity-40" />
          <div className="flex gap-2 flex-shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: selectedCategory === cat ? "#ff4d1c" : "hsl(var(--muted))",
                  color: selectedCategory === cat ? "white" : "hsl(var(--muted-foreground))",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Course grid.
            This block used to fall back to six hardcoded courses whenever the
            fetch was loading, failed, or came back empty — with invented
            ratings, and slugs that did not match any real course, so every card
            led to "No course found". Each state now says what it actually is. */}
        {loading ? (
          <div className="mb-16">
            <CardGridSkeleton count={6} columns={3} />
          </div>
        ) : error ? (
          <StateMessage
            tone="error"
            title="Couldn't load the courses"
            description="Something went wrong reaching the catalogue. Your progress is safe — this is just the listing."
            onRetry={refetch}
            className="mb-16"
          />
        ) : filteredCourses.length === 0 ? (
          <StateMessage
            title={selectedCategory === "All" ? "No courses published yet" : `Nothing in ${selectedCategory} yet`}
            description={
              selectedCategory === "All"
                ? "New courses are on the way. Check back soon."
                : "Try another category, or browse them all."
            }
            icon={BookOpen}
            className="mb-16"
            action={
              selectedCategory !== "All" ? (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="btn-orange mt-5 mx-auto"
                  style={{ borderRadius: 10, padding: "9px 16px", fontSize: 13 }}
                >
                  Show all courses
                </button>
              ) : undefined
            }
          />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCourses.map((course: any, i: number) => (
            <div
              key={course.id}
              className={`reveal delay-${(i % 3) + 1} card-lift group rounded-2xl overflow-hidden border`}
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <CourseCover
                  src={course.image}
                  title={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                <span className={`pill-orange ${levelPill(course.level)} absolute top-3 left-3`} style={{ fontSize: 11, padding: "4px 10px" }}>
                  {course.level}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                  {/* Enrolment count and star rating removed: both are real
                      columns but hold seeded, invented values, so they told the
                      visitor something false. See the same note on Home.tsx. */}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.level}</span>
                </div>
                <h2 className="font-bold text-lg mb-2 transition-colors group-hover:text-orange-500 line-clamp-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {course.title}
                </h2>
                <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="pill-orange" style={{ fontSize: 10 }}>{course.category}</span>
                  <Link
                    to={`/${course.slug}`}
                    className="flex items-center gap-1.5 text-sm font-bold transition-all"
                    style={{ fontFamily: "'Syne', sans-serif", color: "#ff4d1c" }}
                  >
                    Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Bottom CTA */}
        <div
          className="reveal rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,77,28,0.15), transparent)" }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
              Can't Find What You're Looking For?
            </h2>
            <p className="mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Contact us for custom learning paths or suggest a course you'd like to see
            </p>
            <Link to="/contact" className="btn-orange">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
