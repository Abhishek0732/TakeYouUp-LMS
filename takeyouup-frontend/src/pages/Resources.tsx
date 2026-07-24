import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChartColumn,
  Languages,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories } from "@/api/resources";
import { ResourceCategoriesSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";
import { useNavigate } from "react-router-dom";
import useSeo from "@/hooks/useSeo";

const iconMap = {
  "quantitative-aptitude": BrainCircuit,
  "data-interpretation": ChartColumn,
  "logical-reasoning": Target,
  "verbal-reasoning": Languages,
};

const Resources = () => {
  useSeo({
    title: "Aptitude Resources",
    description:
      "Aptitude practice grouped into quantitative, data interpretation, logical and verbal reasoning, each with topic pages full of solved MCQs.",
  });

  const navigate = useNavigate();
  const [resourceCategories, setResourceCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Kept apart from the empty list so an outage never reads as "no categories".
  const [error, setError] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    setError(false);
    // Browsing the catalogue is public — the sign-in gate lives on the topic
    // page, where practising actually starts.
    getCategories()
      .then(setResourceCategories)
      .catch(() => {
        setResourceCategories([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#0d1016] text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(255,122,24,0.32), transparent 34%), radial-gradient(circle at bottom right, rgba(20,184,166,0.18), transparent 30%)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-3xl">
            <div className="pill-orange mb-6 w-fit border-white/10 bg-white/10 text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Exam resources and topic-wise practice
            </div>
            <h1
              className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.04em",
              }}
            >
              One resource hub for every
              <span className="gradient-text block">
                {" "}
                aptitude prep session.
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Choose a category, open a focused topic page, and start solving
              MCQs in a layout that feels clear and built for consistent
              practice.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-12">
          <div>
            <div className="section-tag">Resource Categories</div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Start with the area you want to improve today
            </h2>
          </div>
        </div>

        {!loading && error && (
          <StateMessage
            tone="error"
            title="Couldn't load the resource categories"
            description="Something went wrong while fetching the catalogue. The categories are still there — please try again."
            onRetry={loadCategories}
            retryLabel="Reload categories"
          />
        )}

        {!loading && !error && resourceCategories.length === 0 && (
          <StateMessage
            tone="empty"
            icon={BookOpen}
            title="No resource categories yet"
            description="Practice categories haven't been published so far. Check back soon — new aptitude sets are added regularly."
          />
        )}

        {loading && <ResourceCategoriesSkeleton count={4} />}

        {!loading && !error && resourceCategories.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {resourceCategories.map((category) => {
            const Icon =
              iconMap[category.slug as keyof typeof iconMap] ?? BookOpen;

            return (
              <Link
                key={category.slug}
                to={`/resources/${category.slug}`}
                className="card-lift group relative overflow-hidden rounded-[28px] border border-border bg-card p-7 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${category.accent}55`;
                  e.currentTarget.style.background = `linear-gradient(135deg, ${category.accent}14 0%, hsl(var(--card)) 58%)`;
                  e.currentTarget.style.boxShadow = `0 24px 52px ${category.accent}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "hsl(var(--border))";
                  e.currentTarget.style.background =
                    "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${category.accent}, transparent)`,
                  }}
                />
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${category.accent}, #ffb800)`,
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3
                  className="mb-3 text-2xl font-bold transition-colors duration-300 group-hover:text-[color:var(--resource-accent)]"
                  style={{ ["--resource-accent" as string]: category.accent }}
                >
                  {category.title}
                </h3>
                <p className="mb-6 text-sm leading-7 text-muted-foreground">
                  {category.description}
                </p>

                <div
                  className="flex items-center gap-2 font-display text-sm font-bold transition-all group-hover:gap-3"
                  style={{ color: category.accent }}
                >
                  Explore category
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
};

export default Resources;
