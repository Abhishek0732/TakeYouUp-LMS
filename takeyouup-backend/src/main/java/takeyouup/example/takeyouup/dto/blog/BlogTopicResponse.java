package takeyouup.example.takeyouup.dto.blog;

import takeyouup.example.takeyouup.model.blog.BlogTopic;

import java.util.UUID;

/**
 * A blog topic as the API returns it. {@code postCount} is the number of
 * PUBLISHED posts filed under it, so the public menu can show "12 articles"
 * without leaking drafts.
 */
public record BlogTopicResponse(
        UUID id,
        String name,
        String slug,
        String description,
        int sortOrder,
        boolean active,
        long postCount
) {
    public static BlogTopicResponse from(BlogTopic t, long postCount) {
        return new BlogTopicResponse(
                t.getId(), t.getName(), t.getSlug(), t.getDescription(),
                t.getSortOrder(), t.isActive(), postCount);
    }
}
