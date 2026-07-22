import { useState } from "react";
import { ChevronDown } from "lucide-react";
import useSiteContent from "@/hooks/useSiteContent";

/**
 * The questions people actually ask before signing up, edited from the admin.
 * Also emitted as FAQPage structured data, which is what lets these appear as
 * expandable results in search — the main SEO win available to a landing page.
 */
const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  const { items } = useSiteContent();
  const faqs = items("HOME_FAQ");

  // Nothing to ask, nothing to show — including no empty FAQPage block, which
  // would be worse than no structured data at all.
  if (faqs.length === 0) return null;

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
          {faqs.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.id} className="rounded-2xl border overflow-hidden"
                style={{ background: "hsl(var(--card))" }}>
                <button
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
                >
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1rem" }}>
                    {item.title}
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
                    {item.body}
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
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.title,
              acceptedAnswer: { "@type": "Answer", text: f.body },
            })),
          }),
        }}
      />
    </section>
  );
};

export default Faq;
