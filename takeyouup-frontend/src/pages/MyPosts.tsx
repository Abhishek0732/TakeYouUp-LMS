import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, PenLine, Pencil, Send, Trash2 } from "lucide-react";
import {
  deleteMyPost,
  fetchMyPosts,
  submitMyPost,
  type BlogPost,
} from "@/api/blog";
import PostStatusBadge from "@/components/blog/PostStatusBadge";
import { formatPostDate } from "@/components/blog/BlogCard";
import StateMessage from "@/components/StateMessage";
import { PostRowsSkeleton } from "@/components/Skeletons";
import useSeo from "@/hooks/useSeo";

const errText = (e: any, fallback: string) => e?.response?.data?.message || e?.message || fallback;

/**
 * The author's own posts, across every status.
 *
 * This is where the review loop is visible: a draft can be submitted, a
 * rejected post carries its reason and can be edited and resubmitted, and a
 * published one links out to its live page. Deleting is allowed for anything not
 * yet public — a live post can only be taken down by an admin.
 */
const MyPosts = () => {
  useSeo({ title: "My posts", noindex: true });
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["myBlogPosts"],
    queryFn: fetchMyPosts,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["myBlogPosts"] });
    queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
  };

  const onSubmit = async (post: BlogPost) => {
    try {
      await submitMyPost(post.id);
      toast.success("Sent for review");
      invalidate();
    } catch (e: any) {
      toast.error(errText(e, "Could not submit"));
    }
  };

  const onDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    try {
      await deleteMyPost(post.id);
      toast.success("Post deleted");
      invalidate();
    } catch (e: any) {
      toast.error(errText(e, "Could not delete"));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>My posts</h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Your drafts, submissions and published articles.
          </p>
        </div>
        <Link to="/blog/new" className="btn-orange whitespace-nowrap">
          <PenLine className="h-4 w-4" /> New post
        </Link>
      </div>

      {isLoading ? (
        <PostRowsSkeleton count={4} />
      ) : error ? (
        <StateMessage
          tone="error"
          title="Couldn't load your posts"
          description="Something went wrong. Please try again."
          onRetry={() => refetch()}
        />
      ) : !posts || posts.length === 0 ? (
        <StateMessage
          title="You haven't written anything yet"
          description="Share what you've been learning — your first post is a click away."
          icon={PenLine}
          action={
            <Link to="/blog/new" className="btn-orange mx-auto mt-5" style={{ width: "fit-content" }}>
              Write your first post
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {post.title}
                  </h2>
                  <PostStatusBadge status={post.status} />
                </div>
                <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>
                  {post.topicName || "No topic"}
                  {post.status === "PUBLISHED" && post.publishedAt
                    ? ` · published ${formatPostDate(post.publishedAt)}`
                    : post.updatedAt
                    ? ` · updated ${formatPostDate(post.updatedAt)}`
                    : ""}
                </p>
                {post.status === "REJECTED" && post.rejectionReason && (
                  <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>
                    Reviewer: {post.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                {post.status === "PUBLISHED" && (
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                    style={{ borderColor: "hsl(var(--border))" }}
                    title="View live post"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Link>
                )}
                {(post.status === "DRAFT" || post.status === "REJECTED") && (
                  <button
                    onClick={() => onSubmit(post)}
                    className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                    style={{ borderColor: "hsl(var(--border))", color: "#22c55e" }}
                    title="Submit for review"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit
                  </button>
                )}
                <Link
                  to={`/blog/edit/${post.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                  style={{ borderColor: "hsl(var(--border))" }}
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                {post.status !== "PUBLISHED" && (
                  <button
                    onClick={() => onDelete(post)}
                    className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                    style={{ borderColor: "hsl(var(--border))", color: "#ef4444" }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
