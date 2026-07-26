import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, User, Newspaper } from "lucide-react";
import { fetchBlogPost, BlogPostNotFound } from "@/api/blog";
import { formatPostDate } from "@/components/blog/BlogCard";
import RichContent from "@/components/RichContent";
import StateMessage from "@/components/StateMessage";
import { ArticleSkeleton } from "@/components/Skeletons";
import useSeo from "@/hooks/useSeo";

/**
 * A single blog article.
 *
 * Only ever renders a PUBLISHED post — the endpoint 404s on anything else, so a
 * draft's slug is indistinguishable from a made-up one, and both land on the
 * noindex not-found panel. The body is the same Markdown pipeline as a lesson,
 * so fenced code blocks get highlighting and the in-place Run button for free.
 */
const BlogPost = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  /**
   * A real "back", not a filter.
   *
   * This used to be a link to `/blog?topic=<this post's topic>`, which quietly
   * applied a filter the reader never chose: land on /blog with "All", open a
   * post, hit this arrow, and you'd bounce to the blog filtered by that post's
   * topic. Instead, return to whatever listing they actually came from — All, or
   * the topic THEY picked — mirroring the browser back button. Falls back to the
   * unfiltered blog on a cold load (e.g. the post opened from a shared link).
   */
  const goBack = () => {
    const idx = (window.history.state && window.history.state.idx) || 0;
    if (idx > 0) navigate(-1);
    else navigate("/blog");
  };

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => fetchBlogPost(slug),
    retry: (count, err) => !(err instanceof BlogPostNotFound) && count < 2,
    staleTime: 60_000,
  });

  const notFound = error instanceof BlogPostNotFound;

  useSeo({
    title: notFound ? "Post Not Found" : post?.title ?? "Blog",
    description: notFound
      ? "This address doesn't match any published post on TakeYouUp."
      : post?.excerpt ??
        "An article from the TakeYouUp community.",
    noindex: notFound,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-10 sm:px-6">
        <ArticleSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <StateMessage
          headingAs="h1"
          title="Post not found"
          description="This address doesn't match any published post. It may have been unpublished or the link is wrong."
          icon={Newspaper}
          action={
            <Link
              to="/blog"
              className="btn-orange mx-auto mt-5"
              style={{ borderRadius: 10, padding: "9px 16px", fontSize: 13 }}
            >
              Back to the blog
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <StateMessage
          tone="error"
          title="Couldn't load this post"
          description="Something went wrong reaching the blog."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const date = formatPostDate(post.publishedAt);

  // schema.org/BlogPosting so a search result can show this as an article.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? undefined,
    articleSection: post.topicName ?? undefined,
    image: post.coverImageUrl
      ? `${window.location.origin}${post.coverImageUrl}`
      : undefined,
    publisher: { "@type": "Organization", name: "TakeYouUp" },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <button
        type="button"
        onClick={goBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        <ArrowLeft className="h-4 w-4" /> Back to the blog
      </button>

      <article>
        {post.topicName && (
          <Link
            to={post.topicSlug ? `/blog?topic=${post.topicSlug}` : "/blog"}
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(255,77,28,0.1)", color: "#ff4d1c" }}
          >
            {post.topicName}
          </Link>
        )}

        <h1
          className="mb-4 text-3xl font-bold leading-tight md:text-4xl"
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
        >
          {post.title}
        </h1>

        {/* Standfirst — the author's summary, shown as a lead paragraph under
            the headline (it also serves as the SEO description and card blurb). */}
        {post.excerpt && (
          <p
            className="mb-6 text-lg leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          className="mb-8 flex flex-wrap items-center gap-4 text-sm"
          style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}
        >
          {post.authorName && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.authorName}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readMinutes} min read
          </span>
          {date && <span>{date}</span>}
        </div>

        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt=""
            className="mb-8 w-full rounded-2xl border object-cover"
            style={{ borderColor: "hsl(var(--border))", aspectRatio: "16/9" }}
          />
        )}

        <RichContent text={post.content} />
      </article>

      <div
        className="mt-12 rounded-2xl border p-6 text-center"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
      >
        <h2 className="mb-1 text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
          Got something to share?
        </h2>
        <p className="mb-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Anyone with an account can write for the blog. Tell the community what you've learned.
        </p>
        <Link to="/blog/new" className="btn-orange mx-auto" style={{ width: "fit-content" }}>
          Write a post
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
