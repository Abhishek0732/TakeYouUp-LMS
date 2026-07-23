package takeyouup.example.takeyouup.enums;

/**
 * Lifecycle of a community blog post.
 *
 * <pre>
 *   DRAFT  ── submit ──▶  PENDING ── approve ──▶  PUBLISHED
 *     ▲                     │  │                     │
 *     │ edit                │  └── reject ──▶ REJECTED│
 *     └─────────────────────┘                  │     │ author edits
 *                                               ▼     ▼
 *                                             DRAFT  PENDING (re-review)
 * </pre>
 *
 * Only {@link #PUBLISHED} is ever visible to the public. Everything else lives
 * behind the author's own dashboard or the admin review queue. Editing a
 * PUBLISHED post drops it back to PENDING on purpose: the promise of the feature
 * is that an admin has vouched for everything the public can read, so a change
 * has to be vouched for again.
 */
public enum PostStatus {
    /** Being written; private to the author, editable. */
    DRAFT,
    /** Submitted and waiting in the admin review queue. */
    PENDING,
    /** Approved by an admin — the only status the public can see. */
    PUBLISHED,
    /** Turned down by an admin, with a reason the author can read and act on. */
    REJECTED
}
