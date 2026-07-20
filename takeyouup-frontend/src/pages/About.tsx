import { Target, Eye, Award, Users, BookOpen, TrendingUp } from "lucide-react";
import abhishek from "../assets/abhishek-photo.jpeg";
import { useEffect, useRef } from "react";
import CountUp from "react-countup";

const About = () => {
  useEffect(() => {
    document.title = "About | TakeYouUp - Master Programming & Build Your Future";
  }, []);

  const revealRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = revealRef.current?.querySelectorAll(".reveal") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const stats = [
    { label: "Active Students", value: 10000, suffix: "+", icon: Users },
    { label: "Courses Offered", value: 50, suffix: "+", icon: BookOpen },
    { label: "Success Rate", value: 95, suffix: "%", icon: TrendingUp },
    { label: "Certifications", value: 8500, suffix: "+", icon: Award },
  ];

  const values = [
    { icon: Target, title: "Our Mission", description: "To make quality programming education accessible to everyone, regardless of their background or location. We believe in empowering individuals through knowledge." },
    { icon: Eye, title: "Our Vision", description: "To become the world's leading platform for learning programming, where students can transform their careers and achieve their dreams through technology." },
    { icon: Award, title: "Our Values", description: "Excellence in education, commitment to student success, innovation in teaching methods, and building a supportive learning community." },
  ];

  const whyReasons = [
    "Industry-expert instructors with years of experience",
    "Hands-on projects and real-world applications",
    "Flexible learning at your own pace",
    "Active community support and mentorship",
    "Regular content updates with latest technologies",
    "Career guidance and interview preparation",
  ];

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
              We're on a mission to transform lives through quality programming education.
              Learn from industry experts and join a community of passionate learners.
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
              <p className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                <CountUp end={stat.value} duration={2} separator="," suffix={stat.suffix} />
              </p>
              <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mission / Vision / Values */}
        <div>
          <div className="text-center mb-10 reveal">
            <div className="section-tag justify-center">Our Foundation</div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className={`reveal delay-${i + 1} card-lift rounded-2xl p-7 border group`}
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all" style={{ background: "hsl(var(--muted))" }}>
                  <v.icon className="h-6 w-6" style={{ color: "#ff4d1c" }} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
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
                <p>TakeYouUp was founded in 2020 with a simple yet powerful vision: to make programming education accessible to everyone. What started as a small online tutoring service has grown into a comprehensive learning platform serving thousands of students worldwide.</p>
                <p>Our founders, experienced software engineers from top tech companies, recognized a gap in the market for high-quality, practical programming education. They combined their industry expertise with a passion for teaching to create courses that not only teach theory but also focus on real-world application.</p>
                <p>Today, we're proud to offer a wide range of courses covering everything from programming fundamentals to advanced topics in machine learning and system design. Our commitment to excellence and student success drives everything we do.</p>
              </div>
            </div>
          </div>
        </div>

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
                <img src={abhishek} alt="Abhishek Kumar Verma" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Abhishek Kumar Verma</h3>
                <span className="pill-orange text-xs">Founder & CEO</span>
                <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Software Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div
          className="reveal rounded-3xl p-10 relative overflow-hidden"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,77,28,0.2), transparent)" }} />
          <div className="relative z-10">
            <div className="section-tag justify-center">Why Us</div>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>Why Choose TakeYouUp?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whyReasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,77,28,0.15)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "#ff4d1c" }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
