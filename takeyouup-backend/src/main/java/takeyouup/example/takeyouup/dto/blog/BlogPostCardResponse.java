package takeyouup.example.takeyouup.dto.blog;

import takeyouup.example.takeyouup.model.blog.BlogPost;

import java.time.LocalDateTime;

/**
 * A post as it appears in a listing grid — enough to draw the card, and
 * deliberately NOT the body.
 *
 * Two reasons the body is absent: a listing of many posts should not drag every
 * article's full LONGTEXT into one response, and this shape is returned on the
 * public endpoint, so it must not be able to carry anything private. The author
 * is named, never emailed.
 */
public record BlogPostCardResponse(
        String slug,
        String title,
        String excerpt,
        String coverImageUrl,
        String topicName,
        String topicSlug,
        String authorName,
        int readMinutes,
        LocalDateTime publishedAt
) {
    public static BlogPostCardResponse from(BlogPost p) {
        return new BlogPostCardResponse(
                p.getSlug(),
                p.getTitle(),
                p.getExcerpt(),
                p.getCoverImageUrl(),
                p.getTopic() != null ? p.getTopic().getName() : null,
                p.getTopic() != null ? p.getTopic().getSlug() : null,
                p.getAuthor() != null ? p.getAuthor().getName() : null,
                p.getReadMinutes(),
                p.getPublishedAt());
    }
}
