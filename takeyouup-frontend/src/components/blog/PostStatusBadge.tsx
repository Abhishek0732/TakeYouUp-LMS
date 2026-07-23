import type { PostStatus } from "@/api/blog";

/**
 * The little coloured pill that tells an author where a post stands. The four
 * states read very differently to a writer — "in review" is hopeful, "changes
 * needed" is a to-do — so each gets its own wording and colour rather than a
 * bare enum name.
 */
const MAP: Record<PostStatus, { label: string; bg: string; fg: string }> = {
  DRAFT: { label: "Draft", bg: "rgba(148,163,184,0.15)", fg: "#94a3b8" },
  PENDING: { label: "In review", bg: "rgba(234,179,8,0.15)", fg: "#eab308" },
  PUBLISHED: { label: "Published", bg: "rgba(34,197,94,0.15)", fg: "#22c55e" },
  REJECTED: { label: "Changes needed", bg: "rgba(239,68,68,0.15)", fg: "#ef4444" },
};

const PostStatusBadge = ({ status }: { status: PostStatus }) => {
  const s = MAP[status] ?? MAP.DRAFT;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
};

export default PostStatusBadge;
