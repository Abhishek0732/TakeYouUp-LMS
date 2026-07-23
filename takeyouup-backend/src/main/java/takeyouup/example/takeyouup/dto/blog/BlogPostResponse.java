package takeyouup.example.takeyouup.dto.blog;

import takeyouup.example.takeyouup.enums.PostStatus;
import takeyouup.example.takeyouup.model.blog.BlogPost;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * A post in full, body included.
 *
 * Serves three readers: the public detail page (only ever for a PUBLISHED post,
 * where {@code status} is harmless), the author viewing their own draft, and the
 * admin reviewing the queue. The author is named, never emailed. {@code topicId}
 * is here so the edit form can pre-select the topic; {@code rejectionReason} so
 * the author knows what to fix.
 */
public record BlogPostResponse(
        UUID id,
        String slug,
        String title,
        String excerpt,
        String content,
        String coverImageUrl,
        UUID topicId,
        String topicName,
        String topicSlug,
        String authorName,
        PostStatus status,
        String rejectionReason,
        int readMinutes,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BlogPostResponse from(BlogPost p) {
        return new BlogPostResponse(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getExcerpt(),
                p.getContent(),
                p.getCoverImageUrl(),
                p.getTopic() != null ? p.getTopic().getId() : null,
                p.getTopic() != null ? p.getTopic().getName() : null,
                p.getTopic() != null ? p.getTopic().getSlug() : null,
                p.getAuthor() != null ? p.getAuthor().getName() : null,
                p.getStatus(),
                p.getRejectionReason(),
                p.getReadMinutes(),
                p.getPublishedAt(),
                p.getCreatedAt(),
                p.getUpdatedAt());
    }
}
