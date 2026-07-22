import { Award, Code, BookOpen, GraduationCap } from "lucide-react";
import abhishek from "../assets/abhishek-photo.jpeg";
import { useEffect, useRef } from "react";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/api/stats";
import useSeo from "@/hooks/useSeo";
import useSiteContent from "@/hooks/useSiteContent";
import { contentIcon } from "@/lib/contentIcons";

const About = () => {
  useSeo({
    title: "About",
    description:
      "Who builds TakeYouUp and why: the mission behind the platform, how the catalogue is put together, and live counts of the content on it.",
  });

  const { items, text } = useSiteContent();
  const values = items("ABOUT_VALUE");
  const whyReasons = items("ABOUT_REASON");
  const story = items("ABOUT_STORY");

  const revealRef = useRef<HTMLDivElement>(null);
  // Deps and the :not(.in-view) filter matter here for the same reason as on
  // Home: the values, story and why-us rows now load from the content API after
  // mount, so a run-once observer never saw them and they stayed invisible.
  useEffect(() => {
    const els = revealRef.current?.querySelectorAll(".reveal:not(.in-view)") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [values.length, whyReasons.length, story.length]);

  // Every figure here used to be invented: "10,000+ Active Students" (against a
  // handful of real accounts, and contradicting the Home page's "5,000+"),
  // "50+ Courses Offered", a "95% Success Rate" nobody measured, and "8,500+
  // Certifications". They are now live counts of content that genuinely exists.
  const { data: platform } = useQuery({
    queryKey: ["platformStats"],
    queryFn: fetchStats,
    staleTime: 5 * 60_000,
  });

  const stats = [
    { label: "Courses", value: platform?.courses, suffix: "", icon: BookOpen },
    { label: "Lessons", value: platform?.lessons, suffix: "", icon: GraduationCap },
    { label: "Practice Problems", value: platform?.practiceProblems, suffix: "", icon: Code },
    { label: "Quiz Questions", value: platform?.quizQuestions, suffix: "", icon: Award },
  ];

  // Admin-editable copy. The "why us" reasons are each a feature you can go and
  // use right now, rather than a claim about staff or community that does not
  // yet exist ("industry-expert instructors", "active community support and
  // mentorship").

  return (
    <div ref={revealRef} style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-20 animate-blob" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="animate-fade-up max-w-3xl mx-auto">
            <div className="section-tag justify-center">Who We Are</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              About <span className="gradient-text">TakeYouUp</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              {text(
                "about.hero.subtitle",
                "We're on a mission to transform lives through quality programming education. Learn from industry experts and join a community of passionate learners.",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`reveal delay-${i + 1} card-lift rounded-2xl p-6 text-center border`}
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div className="mx-auto mb-3 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,77,28,0.1)" }}>
                <stat.icon className="h-5 w-5" style={{ color: "#ff4d1c" }} />
              </div>
              <p className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "'Syne', sans-serif", minHeight: "1.2em" }}>
                {stat.value === undefined ? (
                  <span
                    className="skeleton"
                    style={{ display: "inline-block", width: "2.5ch", height: "1.5rem", borderRadius: 4, verticalAlign: "middle" }}
                  />
                ) : (
                  <CountUp end={stat.value} duration={2} separator="," suffix={stat.suffix} />
                )}
              </p>
              <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mission / Vision / Values */}
        {values.length > 0 && (
        <div>
          <div className="text-center mb-10 reveal">
            <div className="section-tag justify-center">Our Foundation</div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = contentIcon(v.icon, Award);
              return (
              <div
                key={v.id}
                className={`reveal delay-${i + 1} card-lift rounded-2xl p-7 border group`}
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all" style={{ background: "hsl(var(--muted))" }}>
                  <Icon className="h-6 w-6" style={{ color: "#ff4d1c" }} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{v.body}</p>
              </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Our Story */}
        {story.length > 0 && (
        <div className="reveal">
          <div
            className="rounded-3xl p-10 border relative overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 animate-blob-2" style={{ background: "radial-gradient(circle, #ffb800, transparent 70%)", filter: "blur(60px)" }} />
            <div className="relative z-10 max-w-3xl">
              <div className="section-tag">Our History</div>
              <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Our Story</h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {/* Kept honest deliberately. The original copy claimed a 2020
                    founding, "thousands of students worldwide" and plural
                    "founders … from top tech companies" — while the team section
                    directly below lists one person. Overstating the story is the
                    quickest way to make everything else on the page suspect. */}
                {story.map((p) => (
                  <p key={p.id}>{p.body}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Team */}
        <div>
          <div className="text-center mb-10 reveal">
            <div className="section-tag justify-center">The People</div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Meet Our Team</h2>
          </div>
          <div className="flex justify-center">
            <div
              className="reveal card-lift rounded-2xl overflow-hidden border group w-64"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div className="aspect-square overflow-hidden">
                <img src={abhishek} alt={text("about.team.name", "Abhishek Kumar Verma")} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{text("about.team.name", "Abhishek Kumar Verma")}</h3>
                <span className="pill-orange text-xs">{text("about.team.role", "Founder & CEO")}</span>
                <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Software Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        {whyReasons.length > 0 && (
        <div
          className="reveal rounded-3xl p-10 relative overflow-hidden"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,77,28,0.2), transparent)" }} />
          <div className="relative z-10">
            <div className="section-tag justify-center">Why Us</div>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>Why Choose TakeYouUp?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whyReasons.map((reason) => (
                <div key={reason.id} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,77,28,0.15)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "#ff4d1c" }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{reason.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default About;
