import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Clock3,
  GraduationCap,
  Layers3,
} from "lucide-react";
import { findResourceCategory } from "@/data/resources";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

const difficultyStyles: Record<string, string> = {
  Beginner: "pill-green",
  Intermediate: "pill-gold",
  Advanced: "pill-orange",
};

const ResourceCategory = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  // const category = findResourceCategory(categorySlug);
  // const [category, setCategory] = useState([]);
  const [category, setCategory] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchCategory = async () => {
      try {
        setLoading(true);
        console.log(`/resources/categories/${categorySlug}`);
        const res = await api.get(`/resources/categories/${categorySlug}`);
        // console.log(res.data.topics.map((t: any) => t.title));
        setCategory(res.data);
        console.log(category.topics);
      } catch (err: any) {
        console.log(err.response?.data?.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categorySlug, navigate]);

  // if (!category) {
  //   return <Navigate to="/resources" replace />;
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Clock3 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `linear-gradient(135deg, ${category.accent}18 0%, transparent 45%), radial-gradient(circle at top right, ${category.accent}22 0%, transparent 30%)`,
          }}
        />
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
          <Link
            to="/resources"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>
          <div>
            <div className="section-tag">Topic Library</div>
            <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
              {category.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {category.heroText}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <div className="mb-8">
          <div>
            <div className="section-tag">Related Topics</div>
            <h2 className="text-3xl font-extrabold">
              Choose a topic and start solving
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {category.topics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/resources/${category.slug}/${topic.slug}`}
              className="card-lift group rounded-[28px] border border-border bg-card p-6 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${category.accent}55`;
                e.currentTarget.style.background = `linear-gradient(135deg, ${category.accent}14 0%, hsl(var(--card)) 55%)`;
                e.currentTarget.style.boxShadow = `0 22px 48px ${category.accent}1f`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "hsl(var(--border))";
                e.currentTarget.style.background =
                  "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <span
                  className={`pill-orange ${difficultyStyles[topic.difficulty] ?? ""}`}
                >
                  {topic.difficulty}
                </span>
              </div>
              <h3
                className="mb-3 text-2xl font-bold transition-colors duration-300 group-hover:text-[color:var(--topic-accent)]"
                style={{ ["--topic-accent" as string]: category.accent }}
              >
                {topic.title}
              </h3>
              <p className="mb-6 text-sm leading-7 text-muted-foreground">
                {topic.summary}
              </p>

              <div
                className="flex items-center gap-2 font-display text-sm font-bold transition-all group-hover:gap-3"
                style={{ color: category.accent }}
              >
                Open MCQ practice
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-border bg-muted/40 p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Layers3 className="h-4 w-4" />
            Suggested flow
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Pick one topic, finish the MCQ set in one sitting, review the
            explanations, and then return here to move to the next related
            concept. This keeps practice focused and helps students build
            momentum.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ResourceCategory;
