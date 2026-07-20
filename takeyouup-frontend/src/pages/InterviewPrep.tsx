import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Clock, Users, Star, Zap } from "lucide-react"

const InterviewPrep = () => {
  useEffect(() => {
    document.title = "Interview | TakeYouUp - Master Programming & Build Your Future";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All")
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = revealRef.current?.querySelectorAll(".reveal") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [selectedCategory]);

  const courses = [
    { id: 1, title: "DSA Interview Questions", description: "Master Real DSA Interview Questions.", level: "Intermediate", duration: "12 weeks", students: 1200, rating: 4.8, image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop", category: "Programming" },
    { id: 2, title: "Python Interview Questions", description: "Learn Python from basics to advanced topics. Perfect for beginners starting their coding journey.", level: "Beginner", duration: "8 weeks", students: 1500, rating: 4.9, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop", category: "Programming" },
    { id: 3, title: "Java Interview Questions", description: "Ace your JAVA interviews with real-world case studies and scalable architecture patterns.", level: "Advanced", duration: "6 weeks", students: 450, rating: 4.8, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop", category: "Programming" },
    { id: 4, title: "OOPS Interview Questions", description: "Ace your Web Development interviews with real-world case studies and scalable architecture patterns.", level: "Advanced", duration: "6 weeks", students: 450, rating: 4.8, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop", category: "Development" },
    { id: 5, title: "React Interview Questions", description: "Ace your React interviews with real-world case studies and scalable architecture patterns.", level: "Advanced", duration: "6 weeks", students: 450, rating: 4.8, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop", category: "Development" },
    { id: 6, title: "DBMS Interview Questions", description: "Ace your System Design interviews with real-world case studies and scalable architecture patterns.", level: "Advanced", duration: "6 weeks", students: 450, rating: 4.8, image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=600&h=400&fit=crop", category: "Development" },
  ];

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];
  const filteredCourses = selectedCategory === "All" ? courses : courses.filter(c => c.category === selectedCategory);

  const levelPill = (level: string) => {
    if (level === "Beginner") return "pill-green";
    if (level === "Intermediate") return "pill-gold";
    return "pill-orange";
  };

  return (
    <div ref={revealRef} style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 animate-blob pointer-events-none" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="animate-fade-up max-w-2xl">
            <div className="section-tag">Crack the Code</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              Interview <span className="gradient-text">Prep</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              Comprehensive question banks designed to ace technical interviews.
              Practice with real questions from top tech companies.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filter */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 reveal in-view">
          <Zap className="h-4 w-4 flex-shrink-0" style={{ color: "#ff4d1c" }} />
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
                  border: "none", cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCourses.map((course, i) => (
            <div
              key={course.id}
              className={`reveal delay-${(i % 3) + 1} card-lift group rounded-2xl overflow-hidden border`}
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)" }} />
                <span className={`pill-orange ${levelPill(course.level)} absolute top-3 left-3`} style={{ fontSize: 11, padding: "4px 10px" }}>{course.level}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.students.toLocaleString()}</span>
                  <span className="flex items-center gap-1" style={{ color: "#f59e0b" }}><Star className="h-3 w-3" style={{ fill: "#f59e0b" }} /> {course.rating}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 transition-colors group-hover:text-orange-500" style={{ fontFamily: "'Syne', sans-serif" }}>{course.title}</h3>
                <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="pill-orange" style={{ fontSize: 10 }}>{course.category}</span>
                  <Link to={`/interview-prep/${course.id}`} className="flex items-center gap-1.5 text-sm font-bold transition-all" style={{ fontFamily: "'Syne', sans-serif", color: "#ff4d1c" }}>
                    Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,77,28,0.15), transparent)" }} />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Can't Find What You're Looking For?</h2>
            <p className="mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>Contact us for custom interview prep or suggest a topic you'd like to see</p>
            <Link to="/contact" className="btn-orange">Get in Touch <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
