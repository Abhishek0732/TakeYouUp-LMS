import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Eye, Loader2, Trash2, X } from "lucide-react";
import {
  adminDeletePost,
  approvePost,
  fetchAdminPosts,
  rejectPost,
  type BlogPost,
  type PostStatus,
} from "@/api/blog";
import { formatPostDate } from "@/components/blog/BlogCard";
import PostStatusBadge from "@/components/blog/PostStatusBadge";
import RichContent from "@/components/RichContent";
import StateMessage from "@/components/StateMessage";
import { useModalA11y } from "@/components/admin/useModalA11y";

const errText = (e: any, fallback: string) => e?.response?.data?.message || e?.message || fallback;

const TABS: { key: PostStatus; label: string }[] = [
  { key: "PENDING", label: "In review" },
  { key: "PUBLISHED", label: "Published" },
  { key: "REJECTED", label: "Rejected" },
];

/**
 * The admin's blog review queue.
 *
 * The default tab is the pending queue — the posts a decision is owed on. An
 * admin reads the whole rendered post in a panel (the same RichContent the
 * public sees, so what they approve is exactly what ships) and either publishes
 * it or sends it back with a reason.
 */
export default function BlogModeration() {
  const [tab, setTab] = useState<PostStatus>("PENDING");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reviewing, setReviewing] = useState<BlogPost | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const data = await fetchAdminPosts(tab, page, 15);
      setRows(data.content);
      setTotalPages(data.totalPages);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { load(); }, [load]);

  const afterDecision = () => {
    setReviewing(null);
    load();
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
        Blog moderation
      </h1>
      <p className="mb-6 text-sm opacity-60">
        Review submitted posts and decide what goes live.
      </p>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(0); }}
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: tab === t.key ? "#ff4d1c" : "hsl(var(--muted))",
              color: tab === t.key ? "#fff" : "hsl(var(--foreground))",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : failed ? (
        <StateMessage tone="error" title="Couldn't load posts" description="Please try again." onRetry={load} />
      ) : rows.length === 0 ? (
        <StateMessage
          title={tab === "PENDING" ? "Nothing waiting for review" : "Nothing here"}
          description={tab === "PENDING" ? "The queue is clear — new submissions will show up here." : undefined}
          icon={Check}
        />
      ) : (
        <>
          <div className="space-y-3">
            {rows.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{post.title}</h2>
                    <PostStatusBadge status={post.status} />
                  </div>
                  <p className="mt-1 text-xs opacity-60" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {post.authorName || "Unknown"} · {post.topicName || "No topic"}
                    {post.updatedAt ? ` · ${formatPostDate(post.updatedAt)}` : ""} · {post.readMinutes} min
                  </p>
                </div>
                <button
                  onClick={() => setReviewing(post)}
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border px-3 py-1.5 text-sm sm:self-auto"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <Eye className="h-4 w-4" /> Review
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                style={{ borderColor: "hsl(var(--border))" }}
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-sm opacity-60">Page {page + 1} of {totalPages}</span>
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

      {reviewing && (
        <ReviewModal post={reviewing} onClose={() => setReviewing(null)} onDone={afterDecision} />
      )}
    </div>
  );
}

// ------------------------------------------------------------------ modal
function ReviewModal({
  post,
  onClose,
  onDone,
}: {
  post: BlogPost;
  onClose: () => void;
  onDone: () => void;
}) {
  const panelRef = useModalA11y(onClose);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const approve = async () => {
    setBusy(true);
    try {
      await approvePost(post.id);
      toast.success("Published");
      onDone();
    } catch (e: any) {
      toast.error(errText(e, "Could not approve"));
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!reason.trim()) { toast.error("Give the author a reason"); return; }
    setBusy(true);
    try {
      await rejectPost(post.id, reason.trim());
      toast.success("Sent back to the author");
      onDone();
    } catch (e: any) {
      toast.error(errText(e, "Could not reject"));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${post.title}"? This removes it for good.`)) return;
    setBusy(true);
    try {
      await adminDeletePost(post.id);
      toast.success("Post deleted");
      onDone();
    } catch (e: any) {
      toast.error(errText(e, "Could not delete"));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Review post"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b p-5" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="min-w-0">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{post.title}</h2>
            <p className="mt-0.5 text-xs opacity-60" style={{ fontFamily: "'DM Mono', monospace" }}>
              {post.authorName || "Unknown"} · {post.topicName || "No topic"} · {post.readMinutes} min read
            </p>
          </div>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {post.coverImageUrl && (
            <img src={post.coverImageUrl} alt="" className="mb-4 w-full rounded-xl object-cover" style={{ aspectRatio: "16/9" }} />
          )}
          {post.excerpt && (
            <p className="mb-4 text-sm italic" style={{ color: "hsl(var(--muted-foreground))" }}>{post.excerpt}</p>
          )}
          <RichContent text={post.content} />
        </div>

        {/* Footer / actions */}
        <div className="border-t p-4" style={{ borderColor: "hsl(var(--border))" }}>
          {rejecting ? (
            <div className="space-y-3">
              <textarea
                autoFocus
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                rows={3}
                maxLength={1000}
                placeholder="Tell the author what needs to change…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="rounded-lg border px-4 py-2 text-sm"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onClick={() => setRejecting(false)}
                  disabled={busy}
                >
                  Back
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: "#ef4444" }}
                  onClick={reject}
                  disabled={busy}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Send back with reason
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                style={{ color: "#ef4444" }}
                onClick={remove}
                disabled={busy}
                title="Delete this post"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <div className="flex gap-2">
              {post.status !== "REJECTED" && (
                <button
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
                  style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444" }}
                  onClick={() => setRejecting(true)}
                  disabled={busy}
                >
                  <X className="h-4 w-4" /> Reject
                </button>
              )}
              {post.status !== "PUBLISHED" && (
                <button
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: "#22c55e" }}
                  onClick={approve}
                  disabled={busy}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Approve & publish
                </button>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
