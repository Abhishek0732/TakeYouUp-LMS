import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Clock,
  ChevronRight,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useCourses } from "@/context/CourseContext";
import CourseCover from "@/components/CourseCover";
import ContinueLearning from "@/components/home/ContinueLearning";
import Faq from "@/components/home/Faq";
import { CardGridSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";
import { useResume } from "@/hooks/useResume";
import TypedHeadline from "@/components/home/TypedHeadline";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/api/stats";
import useSeo from "@/hooks/useSeo";
import useSiteContent from "@/hooks/useSiteContent";
import { contentIcon } from "@/lib/contentIcons";

const Home = () => {
  useSeo({
    title: "",
    description:
      "Free structured courses in DSA, Java, Python, web development and machine learning, with a built-in compiler, quizzes and saved progress.",
  });

  // Real catalogue counts. The strip used to claim "5,000+ students enrolled",
  // "50+ expert instructors" and "4.9★ average rating" — all invented, and the
  // student figure contradicted the About page. These are things we can actually
  // point at, so they can never be wrong.
  const { data: stats } = useQuery({
    queryKey: ["platformStats"],
    queryFn: fetchStats,
    staleTime: 5 * 60_000,
  });

  const { items, text } = useSiteContent();
  const features = items("HOME_FEATURE");
  const steps = items("HOME_STEP");

  const revealRef = useRef<HTMLDivElement>(null);
  // Re-runs when content arrives, and skips anything already revealed.
  //
  // With an empty dependency array this ran once on mount and observed only the
  // .reveal elements that existed at that instant. That was fine while the
  // feature and step cards were hardcoded, but they now arrive from the content
  // API a moment later — so they were never observed, never got .in-view, and
  // sat at `opacity: 0` forever, leaving a tall empty gap under the heading.
  useEffect(() => {
    const els = revealRef.current?.querySelectorAll(".reveal:not(.in-view)") ?? [];
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [features.length, steps.length]);


  // Copy below is admin-editable. Each feature describes something the platform
  // actually does. The previous set leaned on claims about people who do not
  // exist — "built by industry experts", "Expert Instructors: learn directly
  // from engineers at top tech companies" — alongside "job-ready in record
  // time", which promises an outcome nobody can guarantee.

  const { hasProgress, target: resumeTarget } = useResume();

  const { courses, loading, error, refetch } = useCourses();
  const courseList = Array.isArray(courses) ? courses : [];
  // No sample-course fallback. This used to swap in three hardcoded courses
  // when the API failed, with no banner to say so — and their slugs matched
  // nothing in the database, so every "View course" landed on "No course
  // found". A failure now says it failed and offers a retry.
  const displayCourses = courseList.slice(0, 3);

  const levelPill = (level: string) => {
    if (level === "Beginner") return "pill-green";
    if (level === "Intermediate") return "pill-gold";
    return "pill-orange";
  };

  return (
    <div ref={revealRef}>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
        style={{ background: "#0c0c0e" }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 bg-grid opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        {/* Ambient blobs */}
        <div
          className="absolute pointer-events-none animate-blob"
          style={{
            top: -120,
            right: -80,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,77,28,0.35) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute pointer-events-none animate-blob-2"
          style={{
            bottom: -60,
            left: "8%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,184,0,0.22) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 py-24">
          <div className="flex items-center justify-between gap-16">
            {/* Left — copy */}
            <div className="flex-1 max-w-xl">
              {/* Pill badge */}
              <div
                className="pill-orange animate-fade-up anim-d0 mb-8 w-fit"
                style={{ fontSize: 12 }}
              >
                <Sparkles style={{ width: 13, height: 13 }} />
                {text("home.hero.badge", "New courses dropping every week")}
              </div>

              {/* Headline */}
              <h1
                aria-label="Code. Compile. Succeed."
                className="animate-fade-up anim-d1"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(3.2rem, 7vw, 6.5rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  color: "white",
                  marginBottom: "1.5rem",
                }}
              >
                <TypedHeadline />
              </h1>

              {/* Sub */}
              <p
                className="animate-fade-up anim-d2"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  lineHeight: 1.75,
                  maxWidth: 500,
                  marginBottom: "2.5rem",
                }}
              >
                {text(
                  "home.hero.subtitle",
                  "Elevate your programming skills, solve real challenges, and unlock a world of career possibilities — one commit at a time.",
                )}
              </p>

              {/* CTAs */}
              <div
                className="animate-fade-up anim-d3 flex gap-3 flex-wrap"
                style={{ marginBottom: "3rem" }}
              >
                <Link to={hasProgress ? resumeTarget : "/courses"} className="btn-orange">
                  {hasProgress ? "Continue learning" : "Explore Courses"}{" "}
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
                <Link
                  to="/about"
                  className="btn-outline-dark"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  Learn More
                </Link>
              </div>

              {/* Stats strip */}
              <div
                className="animate-fade-up anim-d4 flex gap-10 flex-wrap"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: "2rem",
                }}
              >
                {[
                  [stats?.courses, "structured courses"],
                  [stats?.lessons, "lessons"],
                  [stats?.practiceProblems, "practice problems"],
                ].map(([num, label]) => (
                  <div key={label as string}>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: "1.9rem",
                        color: "white",
                        lineHeight: 1,
                        // Hold the line's height while the count is in flight so
                        // the hero doesn't jump when it arrives.
                        minHeight: "1.9rem",
                      }}
                    >
                      {num === undefined ? (
                        <span
                          className="skeleton"
                          style={{
                            display: "inline-block",
                            width: "2.2ch",
                            height: "1.4rem",
                            borderRadius: 4,
                            verticalAlign: "middle",
                          }}
                        />
                      ) : (
                        num
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.4)",
                        marginTop: 4,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating code card (hidden on mobile) */}
            <div className="hidden lg:block flex-shrink-0 animate-fade-up anim-d3">
              <div
                className="animate-float"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  backdropFilter: "blur(16px)",
                  padding: "24px 28px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.85,
                  width: 340,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                }}
              >
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <span
                      key={c}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: c,
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>
                <div>
                  <span style={{ color: "#ff7a50" }}>const</span>{" "}
                  <span style={{ color: "#ffcc00" }}>learnToCode</span> = ()
                  =&gt; {"{"}
                </div>
                <div>
                  &nbsp;&nbsp;<span style={{ color: "#ff7a50" }}>const</span>{" "}
                  skills = [
                </div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ color: "#7dd3fc" }}>'Python'</span>,
                </div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ color: "#7dd3fc" }}>'DSA'</span>,
                </div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ color: "#7dd3fc" }}>'Java'</span>,
                </div>
                <div>&nbsp;&nbsp;];</div>
                <div>
                  &nbsp;&nbsp;
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>
                    // unlock your potential
                  </span>
                </div>
                <div>
                  &nbsp;&nbsp;<span style={{ color: "#ff7a50" }}>return</span>{" "}
                  skills.<span style={{ color: "#ffcc00" }}>master</span>();
                </div>
                <div>{"}"}</div>
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                  }}
                >
                  ✓ Compiled successfully &nbsp;·&nbsp; 0 errors
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      {features.length > 0 && (
      <section
        style={{ padding: "96px 0", background: "hsl(var(--muted) / 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal in-view">
            <div className="section-tag justify-center">
              {text("home.features.heading", "Why TakeYouUp")}
            </div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Everything you need to{" "}
              <span className="gradient-text">level up fast</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
              gap: 20,
            }}
          >
            {features.map((f, i) => {
              const Icon = contentIcon(f.icon, BookOpen);
              return (
              <div
                key={f.id}
                className={`reveal delay-${i + 1} card-lift rounded-2xl group`}
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="group-hover:bg-orange-500 transition-colors duration-300"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "hsl(var(--foreground))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <Icon style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                  }}
                >
                  {f.body}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════════════ COURSES ═══════════════════ */}
      <section
        style={{ padding: "96px 0", background: "hsl(var(--background))" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 52,
            }}
          >
            <div className="reveal">
              <div className="section-tag">Top Picks</div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.025em",
                  margin: 0,
                }}
              >
                Featured Courses
              </h2>
            </div>
            <Link
              to="/courses"
              className="reveal flex items-center gap-2 font-bold text-sm transition-colors hover:text-orange-500"
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              View all <ChevronRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              // min() keeps the track from having a floor wider than the
              // container: at 320px the viewport minus px-4 leaves 288px, and a
              // hard 300px floor forced the whole page to scroll sideways.
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              gap: 24,
            }}
          >
            {loading && displayCourses.length === 0 && <CardGridSkeleton count={3} columns={3} />}
            {!loading && error && displayCourses.length === 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <StateMessage
                  tone="error"
                  title="Couldn't load the featured courses"
                  description="The catalogue didn't respond. Everything else on the page still works."
                  onRetry={refetch}
                />
              </div>
            )}
            {!loading && !error && displayCourses.length === 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <StateMessage
                  title="No courses published yet"
                  description="New courses are on the way. Check back soon."
                  icon={BookOpen}
                />
              </div>
            )}
            {displayCourses.map((course: any, i: number) => (
              <div
                key={course.id}
                className={`card-lift group rounded-2xl overflow-hidden`}
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                  }}
                >
                  <CourseCover
                    src={course.image}
                    title={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    className="group-hover:scale-105"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                    }}
                  />
                  <span
                    className={`pill-orange ${levelPill(course.level)} absolute`}
                    style={{
                      top: 12,
                      left: 12,
                      fontSize: 11,
                      padding: "4px 10px",
                    }}
                  >
                    {course.level}
                  </span>
                </div>
                <div
                  style={{
                    padding: "22px 24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 10,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    {/* Enrolment counts and star ratings used to sit here. Both
                        are real columns on `course`, but they were seeded with
                        invented values (thousands of students against a handful
                        of real accounts), so showing them told the visitor
                        something untrue. Level and duration are editorial facts
                        about the course itself, which is honest. Put the other
                        two back when they are derived from real enrolments and
                        real submitted ratings. */}
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <BookOpen style={{ width: 12, height: 12 }} />{" "}
                      {course.level}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Clock style={{ width: 12, height: 12 }} />{" "}
                      {course.duration}
                    </span>
                  </div>
                  <h3
                    className="group-hover:text-orange-500 transition-colors"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                      marginBottom: 10,
                    }}
                  >
                    {course.title}
                  </h3>
                  <p
                    style={{
                      color: "hsl(var(--muted-foreground))",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      flex: 1,
                      marginBottom: 18,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description}
                  </p>
                  <Link
                    to={`/${course.slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#ff4d1c",
                      textDecoration: "none",
                    }}
                    className="hover:gap-3 transition-all"
                  >
                    View course <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {steps.length > 0 && (
      <section
        style={{
          background: "hsl(var(--card))",
          borderTop: "1px solid hsl(var(--border))",
          borderBottom: "1px solid hsl(var(--border))",
          padding: "64px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* This slot used to hold three testimonials with invented quotes
              attributed to named people at Amazon, Flipkart and Zomato. Made-up
              social proof is the fastest way to lose a visitor's trust, so it is
              replaced with something true and equally reassuring: what actually
              happens when you start. Put real, attributable testimonials back
              here once there are learners willing to be quoted. */}
          <div className="text-center mb-12 reveal in-view">
            <div className="section-tag justify-center">
              {text("home.steps.heading", "How it works")}
            </div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              From first lesson to <span className="gradient-text">certificate</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
              gap: 20,
            }}
          >
            {steps.map((s, i) => {
              const Icon = contentIcon(s.icon, BookOpen);
              return (
              <div
                key={s.id}
                className={`reveal delay-${i + 1}`}
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 18,
                  padding: "24px 22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: "var(--gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: 18, height: 18, color: "#fff" }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      color: "hsl(var(--muted-foreground))",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {s.extra}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: 8,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
                  {s.body}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      <Faq />
      <ContinueLearning />

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section
        className="noise-overlay relative overflow-hidden"
        style={{ background: "#0c0c0e", padding: "96px 0" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,77,28,0.1) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,77,28,0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div
            className="pill-orange mx-auto mb-7 w-fit animate-fade-up anim-d0"
            style={{ fontSize: 12 }}
          >
            <Terminal style={{ width: 13, height: 13 }} />{" "}
            {text("home.cta.badge", "Free to start — no card required")}
          </div>
          <h2
            className="animate-fade-up anim-d1"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.08,
              color: "white",
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            Ready to write your
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ff4d1c, #ffb800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              success story?
            </span>
          </h2>
          <p
            className="animate-fade-up anim-d2"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto 2.5rem",
            }}
          >
            Join thousands of developers who transformed their careers through
            our structured learning programs.
          </p>
          <div className="animate-fade-up anim-d3 flex gap-3 justify-center flex-wrap">
            <Link to="/courses" className="btn-orange">
              Get Started — it's free{" "}
              <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline-dark"
              style={{
                color: "rgba(255,255,255,0.75)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
