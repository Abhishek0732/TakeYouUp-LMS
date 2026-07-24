import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PenLine, ChevronLeft, ChevronRight, Newspaper, SlidersHorizontal } from "lucide-react";
import { fetchBlogPosts, fetchBlogTopics } from "@/api/blog";
import BlogCard from "@/components/blog/BlogCard";
import { BlogGridSkeleton, ChipsSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";
import useSeo from "@/hooks/useSeo";

const PAGE_SIZE = 9;

/**
 * The blog landing page.
 *
 * Public: findable without an account, which is the point of having a blog at
 * all. The topic filter lives in the URL (?topic=…) so a filtered view is
 * shareable, but the canonical stays /blog so the filters don't read as
 * duplicate pages to a crawler.
 */
const Blog = () => {
  const [params, setParams] = useSearchParams();
  const topic = params.get("topic") || "";
  const [page, setPage] = useState(0);

  useSeo({
    title: "Blog",
    description:
      "Articles from the TakeYouUp community on data structures, web development, careers and more — written by learners, reviewed before they go live.",
    canonicalPath: "/blog",
  });

  const topicsQuery = useQuery({
    queryKey: ["blogTopics"],
    queryFn: fetchBlogTopics,
    staleTime: 5 * 60_000,
  });

  const postsQuery = useQuery({
    queryKey: ["blogPosts", topic, page],
    queryFn: () => fetchBlogPosts({ topic: topic || undefined, page, size: PAGE_SIZE }),
    staleTime: 60_000,
  });

  const selectTopic = (slug: string) => {
    setPage(0);
    if (slug) setParams({ topic: slug });
    else setParams({});
  };

  const posts = postsQuery.data?.content ?? [];
  const totalPages = postsQuery.data?.totalPages ?? 0;

  return (
    <div>
      {/* Hero — same treatment as the Courses page (taller, radial glow, the
          two-tone display heading), with the "Write a post" action kept. */}
      <section
        className="relative py-20 overflow-hidden bg-dots"
        style={{ background: "hsl(var(--background))" }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 animate-blob"
          style={{ background: "radial-gradient(circle, #ff4d1c 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl animate-fade-up">
              <div className="section-tag">Community</div>
              <h1
                className="font-display text-5xl md:text-6xl font-bold mb-5"
                style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}
              >
                The TakeYouUp <span className="gradient-text">Blog</span>
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                What the community is learning, in their own words. Written by learners, reviewed before it goes live.
              </p>
            </div>
            <Link to="/blog/new" className="btn-orange whitespace-nowrap animate-fade-up">
              <PenLine className="h-4 w-4" /> Write a post
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Topic filter — same bar as the Courses page. */}
        <div className="flex items-center gap-3 mb-10 scroll-x pb-2">
          <SlidersHorizontal className="h-4 w-4 flex-shrink-0 opacity-40" />
          {topicsQuery.isLoading ? (
            <ChipsSkeleton count={5} />
          ) : (
            <div className="flex gap-2 flex-shrink-0">
              <TopicChip label="All" active={!topic} onClick={() => selectTopic("")} />
              {(topicsQuery.data ?? []).map((t) => (
                <TopicChip
                  key={t.slug}
                  label={t.name}
                  count={t.postCount}
                  active={topic === t.slug}
                  onClick={() => selectTopic(t.slug)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Posts */}
        {postsQuery.isLoading ? (
          <BlogGridSkeleton count={6} />
        ) : postsQuery.error ? (
          <StateMessage
            tone="error"
            title="Couldn't load the blog"
            description="Something went wrong reaching the posts. Please try again."
            onRetry={() => postsQuery.refetch()}
          />
        ) : posts.length === 0 ? (
          <StateMessage
            title={topic ? "No posts in this topic yet" : "No posts yet"}
            description={
              topic
                ? "Nothing has been published here so far. Be the first to write one."
                : "The blog is just getting started. Be the first to write a post."
            }
            icon={Newspaper}
            action={
              <Link
                to="/blog/new"
                className="btn-orange mx-auto mt-5"
                style={{ width: "fit-content" }}
              >
                <PenLine className="h-4 w-4" /> Write a post
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                  style={{ borderColor: "hsl(var(--border))" }}
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                  style={{ borderColor: "hsl(var(--border))" }}
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const TopicChip = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
    style={{
      fontFamily: "'Syne', sans-serif",
      background: active ? "#ff4d1c" : "hsl(var(--muted))",
      color: active ? "white" : "hsl(var(--muted-foreground))",
      border: "none",
      cursor: "pointer",
    }}
  >
    {label}
    {typeof count === "number" && count > 0 && (
      <span className="ml-1.5 opacity-60">{count}</span>
    )}
  </button>
);

export default Blog;
