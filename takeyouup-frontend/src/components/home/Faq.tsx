import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * The questions people actually ask before signing up. Also emitted as
 * FAQPage structured data, which is what lets these appear as expandable
 * results in search — the main SEO win available to a landing page.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Is TakeYouUp free?",
    a: "Yes. Every course, quiz, practice problem and aptitude set is free, and you keep your progress and certificates. There is no card required and no trial that expires.",
  },
  {
    q: "Do I need programming experience to start?",
    a: "No. The Python, Java and DSA tracks begin from variables and syntax, and each lesson states what it assumes. If you have written a for-loop before, you can skip ahead — progress is tracked per lesson, not per course.",
  },
  {
    q: "How is my progress tracked?",
    a: "Every lesson you finish and every problem you mark solved is saved to your account. Your profile shows completion per course, problems solved by difficulty, quiz scores and your current practice streak, so picking up after a break takes one click.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes. Finish every lesson in a course and a certificate is issued with a unique serial number. Anyone can verify it from its serial without signing in, so it is safe to put on a CV or LinkedIn.",
  },
  {
    q: "What is the difference between Courses, Problems and Resources?",
    a: "Courses teach a topic lesson by lesson with worked code examples. Problems are curated DSA questions on LeetCode, GeeksforGeeks and HackerRank, tracked here by topic and difficulty. Resources are aptitude and reasoning practice — quantitative, data interpretation, logical and verbal — for placement tests.",
  },
  {
    q: "Can I use this to prepare for interviews?",
    a: "That is what it is built for. The DSA course covers the patterns, the problem set gives you graded practice across arrays, trees, graphs and dynamic programming, and the aptitude resources cover the written round that most campus placements start with.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ background: "hsl(var(--background))", padding: "5rem 0" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="section-tag justify-center">Questions</div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Before you start
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.q} className="rounded-2xl border overflow-hidden"
                style={{ background: "hsl(var(--card))" }}>
                <button
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
                >
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1rem" }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 flex-shrink-0"
                    style={{
                      color: "#ff4d1c",
                      transform: expanded ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {expanded && (
                  <p className="px-5 pb-5 text-sm leading-7"
                    style={{ color: "hsl(var(--muted-foreground))" }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Machine-readable copy of the same questions. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
};

export default Faq;
