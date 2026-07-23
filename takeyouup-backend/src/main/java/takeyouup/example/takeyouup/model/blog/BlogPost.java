package takeyouup.example.takeyouup.model.blog;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import takeyouup.example.takeyouup.enums.PostStatus;
import takeyouup.example.takeyouup.model.User;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * A community blog post.
 *
 * Written by any signed-in {@link User}, filed under a {@link BlogTopic}, and
 * shown to the public only once its {@link #status} reaches
 * {@link PostStatus#PUBLISHED}. The moderation trail — who reviewed it, when,
 * and why it was turned down — lives on the row itself rather than a separate
 * audit table, because there is exactly one review decision that matters at a
 * time and the author needs to read the rejection reason.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "blog_posts",
        uniqueConstraints = @UniqueConstraint(columnNames = "slug"))
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    /** URL segment; unique across every post regardless of status. */
    @Column(nullable = false)
    private String slug;

    /** Short summary for cards and the meta description. */
    @Column(columnDefinition = "TEXT")
    private String excerpt;

    /** The article body, Markdown-with-fenced-code exactly like a lesson. */
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    /** Uploads-relative path, resolved to /uploads/… by the browser. */
    private String coverImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private BlogTopic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PostStatus status;

    /** Why an admin turned it down; shown back to the author. Null otherwise. */
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

    /**
     * When the post first went public. Set once, on the first approval, and kept
     * across later re-reviews so an edit does not reset the publication date.
     */
    private LocalDateTime publishedAt;

    /** Estimated reading time in minutes, derived from the word count on save. */
    private int readMinutes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
