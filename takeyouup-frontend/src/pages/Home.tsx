import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Code,
  Users,
  Zap,
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
import { useEffect, useRef } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "TakeYouUp - Master Programming & Build Your Future";
  }, []);

  const revealRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = revealRef.current?.querySelectorAll(".reveal") ?? [];
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
  }, []);

  const staticCourses = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      slug: "data-structures-algorithms",
      description:
        "Master DSA with hands-on practice and real-world problems. Learn sorting, searching, trees, graphs, and dynamic programming.",
      level: "Intermediate",
      duration: "12 weeks",
      students: 1200,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Python Programming Masterclass",
      slug: "python-programming-masterclass",
      description:
        "Learn Python from basics to advanced topics. Perfect for beginners starting their coding journey.",
      level: "Beginner",
      duration: "8 weeks",
      students: 1500,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Java Programming Masterclass",
      slug: "java-programming-masterclass",
      description:
        "Ace your JAVA interviews with real-world case studies and scalable architecture patterns.",
      level: "Advanced",
      duration: "6 weeks",
      students: 450,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      description:
        "Follow carefully curated learning paths built by industry experts.",
    },
    {
      icon: Code,
      title: "Hands-on Projects",
      description:
        "Build production-ready projects as you learn, not toy examples.",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn directly from engineers at top tech companies.",
    },
    {
      icon: Zap,
      title: "Fast Track",
      description:
        "Go from zero to job-ready in record time with focused content.",
    },
  ];

  const { courses, loading, error } = useCourses();
  const courseList = Array.isArray(courses) ? courses : [];
  // Only fall back to the sample cards if the API actually failed. Showing
  // them while merely loading advertised courses that do not exist, and every
  // click landed on a 404.
  const displayCourses = courseList.length > 0
    ? courseList.slice(0, 3)
    : (error ? staticCourses : []);

  const levelPill = (level: string) => {
    if (level === "Beginner") return "pill-green";
    if (level === "Intermediate") return "pill-gold";
    return "pill-orange";
  };

  return (
    <div ref={revealRef}>
      <ContinueLearning />

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
                New courses dropping every week
              </div>

              {/* Headline */}
              <h1
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
                Code.
                <br />
                Compile.
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #ff4d1c 0%, #ffb800 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Succeed.
                </span>
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
                Elevate your programming skills, solve real challenges, and
                unlock a world of career possibilities — one commit at a time.
              </p>

              {/* CTAs */}
              <div
                className="animate-fade-up anim-d3 flex gap-3 flex-wrap"
                style={{ marginBottom: "3rem" }}
              >
                <Link to="/courses" className="btn-orange">
                  Explore Courses{" "}
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
                  ["5,000+", "students enrolled"],
                  ["50+", "expert instructors"],
                  ["4.9★", "average rating"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: "1.9rem",
                        color: "white",
                        lineHeight: 1,
                      }}
                    >
                      {num.replace("★", "")}
                      {num.includes("★") && (
                        <span style={{ color: "#ff4d1c" }}>★</span>
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
      <section
        style={{ padding: "96px 0", background: "hsl(var(--muted) / 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal in-view">
            <div className="section-tag justify-center">Why TakeYouUp</div>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.title}
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
                  <f.icon style={{ width: 20, height: 20, color: "white" }} />
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
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {loading && displayCourses.length === 0 && <CardGridSkeleton count={3} columns={3} />}
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
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Users style={{ width: 12, height: 12 }} />{" "}
                      {course.students?.toLocaleString()}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Clock style={{ width: 12, height: 12 }} />{" "}
                      {course.duration}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#f59e0b",
                      }}
                    >
                      <Star
                        style={{ width: 12, height: 12, fill: "#f59e0b" }}
                      />{" "}
                      {course.rating}
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

      <section
        style={{
          background: "hsl(var(--card))",
          borderTop: "1px solid hsl(var(--border))",
          borderBottom: "1px solid hsl(var(--border))",
          padding: "64px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal in-view">
            <div className="section-tag justify-center">Student Stories</div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              What our learners <span className="gradient-text">say</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                name: "Priya Sharma",
                role: "SDE at Amazon",
                text: "TakeYouUp's DSA course was a game-changer. The structured approach and real interview questions helped me crack Amazon in 3 months.",
                avatar: "PS",
                color: "#8b5cf6",
              },
              {
                name: "Rahul Verma",
                role: "Python Dev at Flipkart",
                text: "Best Python course I've ever taken. The hands-on projects and AI chatbot made complex concepts crystal clear.",
                avatar: "RV",
                color: "#3b82f6",
              },
              {
                name: "Anjali Singh",
                role: "ML Engineer at Zomato",
                text: "The Machine Learning masterclass is incredibly comprehensive. Went from zero ML knowledge to building real models.",
                avatar: "AS",
                color: "#10b981",
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className={`reveal delay-${i + 1}`}
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 18,
                  padding: "24px 22px",
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      style={{
                        width: 14,
                        height: 14,
                        fill: "#f59e0b",
                        color: "#f59e0b",
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    marginBottom: 18,
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: t.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq />

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
            <Terminal style={{ width: 13, height: 13 }} /> Join 5,000+ learners
            today
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
