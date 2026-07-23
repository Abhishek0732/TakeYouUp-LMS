import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import type { BlogPostCard } from "@/api/blog";

/** Human date like "12 Mar 2026"; empty for a post with no publish date yet. */
export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * One post in a grid. The whole card is a single link to the article; the cover
 * falls back to a soft gradient so a post without an image still looks finished
 * rather than broken.
 */
const BlogCard = ({ post }: { post: BlogPostCard }) => {
  const date = formatPostDate(post.publishedAt);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
    >
      <div className="aspect-video w-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: "linear-gradient(135deg, rgba(255,77,28,0.18), rgba(255,184,0,0.12))" }}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {post.topicName && (
          <span
            className="mb-2 self-start rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: "rgba(255,77,28,0.1)", color: "#ff4d1c" }}
          >
            {post.topicName}
          </span>
        )}
        <h3
          className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-orange-500"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            {post.excerpt}
          </p>
        )}
        <div
          className="mt-auto flex items-center gap-4 pt-2 text-xs"
          style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}
        >
          {post.authorName && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {post.authorName}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min read
          </span>
          {date && <span className="ml-auto">{date}</span>}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
