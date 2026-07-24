import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Save, Send, X } from "lucide-react";
import {
  createMyPost,
  fetchBlogTopics,
  fetchMyPost,
  submitMyPost,
  updateMyPost,
  uploadInlineImage,
  uploadMyPostCover,
  type BlogPost,
  type BlogPostInput,
} from "@/api/blog";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import PostStatusBadge from "@/components/blog/PostStatusBadge";
import StateMessage from "@/components/StateMessage";
import { FormSkeleton } from "@/components/Skeletons";
import useSeo from "@/hooks/useSeo";

const inp = "w-full rounded-lg border px-3 py-2.5 text-sm bg-transparent";
const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };
const errText = (e: any, fallback: string) => e?.response?.data?.message || e?.message || fallback;

/**
 * Write a new post or edit one of your own.
 *
 * One screen for both: `/blog/new` starts blank, `/blog/edit/:id` loads an
 * existing draft. The body uses the same MarkdownEditor the course authors use,
 * so a snippet an author writes here renders identically on the published page.
 *
 * A cover image needs a post to attach to, so the uploader only appears once the
 * draft has been saved at least once — until then it nudges the writer to save.
 */
const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useSeo({ title: id ? "Edit post" : "Write a post", noindex: true });

  const editing = Boolean(id);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState(false);

  const [title, setTitle] = useState("");
  const [topicId, setTopicId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<BlogPost["status"] | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const topicsQuery = useQuery({
    queryKey: ["blogTopics"],
    queryFn: fetchBlogTopics,
    staleTime: 5 * 60_000,
  });

  // Load the existing post in edit mode.
  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    fetchMyPost(id)
      .then((p) => {
        if (!alive) return;
        setTitle(p.title);
        setTopicId(p.topicId ?? "");
        setExcerpt(p.excerpt ?? "");
        setContent(p.content ?? "");
        setCoverImageUrl(p.coverImageUrl);
        setStatus(p.status);
        setRejectionReason(p.rejectionReason);
      })
      .catch(() => { if (alive) setLoadError(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const validate = (): boolean => {
    if (!title.trim()) { toast.error("Give your post a title"); return false; }
    if (!topicId) { toast.error("Pick a topic"); return false; }
    if (!content.trim()) { toast.error("Write some content first"); return false; }
    return true;
  };

  const input = (): BlogPostInput => ({
    title: title.trim(),
    topicId,
    excerpt: excerpt.trim() || undefined,
    content,
    coverImageUrl,
  });

  /** Create or update, returning the post id. Toasts and rethrows on failure. */
  const persist = async (): Promise<string> => {
    if (id) {
      await updateMyPost(id, input());
      return id;
    }
    const created = await createMyPost(input());
    // Move to the edit URL so the next save updates instead of creating a
    // second draft, and so the cover uploader (which needs an id) appears.
    navigate(`/blog/edit/${created.id}`, { replace: true });
    return created.id;
  };

  const onSaveDraft = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await persist();
      toast.success("Draft saved");
    } catch (e: any) {
      toast.error(errText(e, "Could not save"));
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const postId = await persist();
      await submitMyPost(postId);
      toast.success("Sent for review — you'll see it here once an admin approves it.");
      navigate("/blog/mine");
    } catch (e: any) {
      toast.error(errText(e, "Could not submit"));
    } finally {
      setSubmitting(false);
    }
  };

  const onPickCover = async (file: File) => {
    if (!id) {
      toast.error("Save a draft first, then add a cover image");
      return;
    }
    setUploading(true);
    try {
      const updated = await uploadMyPostCover(id, file);
      setCoverImageUrl(updated.coverImageUrl);
      setStatus(updated.status);
      toast.success("Cover updated");
    } catch (e: any) {
      toast.error(errText(e, "Could not upload the image"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="w-full mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton mb-6 h-9 w-48 rounded" />
        <FormSkeleton fields={5} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <StateMessage
          title="Can't open this post"
          description="It either doesn't exist or isn't yours to edit."
          action={
            <Link to="/blog/mine" className="btn-orange mx-auto mt-5" style={{ width: "fit-content" }}>
              Back to my posts
            </Link>
          }
        />
      </div>
    );
  }

  const busy = saving || submitting || uploading;
  const publishedWarning = status === "PUBLISHED";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link to="/blog/mine" className="inline-flex items-center gap-1.5 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="h-4 w-4" /> My posts
        </Link>
        {status && <PostStatusBadge status={status} />}
      </div>

      <h1 className="mb-6 text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
        {editing ? "Edit post" : "Write a post"}
      </h1>

      {/* Feedback from the reviewer, if this was turned down */}
      {rejectionReason && (
        <div
          className="mb-6 rounded-xl border p-4 text-sm"
          style={{ borderColor: "rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.06)" }}
        >
          <p className="mb-1 font-semibold" style={{ color: "#ef4444" }}>Changes requested</p>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>{rejectionReason}</p>
        </div>
      )}

      {publishedWarning && (
        <div
          className="mb-6 rounded-xl border p-4 text-sm"
          style={{ borderColor: "rgba(234,179,8,0.4)", background: "rgba(234,179,8,0.06)" }}
        >
          This post is live. Saving changes will send it back for review, and it stays published until then.
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-medium opacity-70" htmlFor="post-title">Title</label>
          <input
            id="post-title"
            className={inp}
            value={title}
            maxLength={160}
            placeholder="A clear, specific title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Topic */}
        <div>
          <label className="mb-1.5 block text-xs font-medium opacity-70" htmlFor="post-topic">Topic</label>
          <select
            id="post-topic"
            className={inp}
            style={optStyle}
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          >
            <option value="" style={optStyle}>Choose a topic…</option>
            {(topicsQuery.data ?? []).map((t) => (
              <option key={t.id} value={t.id} style={optStyle}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <label className="mb-1.5 block text-xs font-medium opacity-70" htmlFor="post-excerpt">
            Summary <span className="opacity-50">(optional)</span>
          </label>
          <textarea
            id="post-excerpt"
            className={inp}
            rows={2}
            maxLength={300}
            placeholder="One or two sentences shown on the card and in search results."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <p className="mt-1 text-[11px] opacity-50">{excerpt.length}/300</p>
        </div>

        {/* Cover */}
        <div>
          <label className="mb-1.5 block text-xs font-medium opacity-70">
            Cover image <span className="opacity-50">(optional)</span>
          </label>
          {coverImageUrl ? (
            <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
              <img src={coverImageUrl} alt="" className="aspect-video w-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl(null)}
                className="absolute right-2 top-2 rounded-lg p-1.5"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
                title="Remove cover (save to apply)"
                aria-label="Remove cover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => (id ? fileRef.current?.click() : toast.error("Save a draft first, then add a cover image"))}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-sm"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? "Uploading…" : id ? "Upload a cover image" : "Save a draft first to add a cover"}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickCover(f); }}
          />
        </div>

        {/* Body */}
        <div>
          <label className="mb-1.5 block text-xs font-medium opacity-70">Content</label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            rows={16}
            placeholder="Write your post in Markdown. Use ``` fences for code and Insert image for pictures."
            onUploadImage={uploadInlineImage}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6" style={{ borderColor: "hsl(var(--border))" }}>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save draft
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          className="btn-orange"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {publishedWarning ? "Save & resubmit" : "Submit for review"}
        </button>
        <p className="text-xs opacity-55">A post is public only after an admin approves it.</p>
      </div>
    </div>
  );
};

export default BlogEditor;
