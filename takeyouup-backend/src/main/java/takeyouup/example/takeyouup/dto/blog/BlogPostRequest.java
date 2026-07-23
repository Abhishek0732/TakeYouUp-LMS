package takeyouup.example.takeyouup.dto.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * What an author sends to create or edit their own post.
 *
 * Deliberately narrow: no id, no status, no author, no review fields. The
 * server owns every one of those — an author cannot set their own post to
 * PUBLISHED by putting it in the payload, because the payload cannot express it.
 * The slug is derived server-side from the title, so it is not accepted here
 * either (a chosen slug is how one author would collide with another's URL).
 */
public record BlogPostRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 160, message = "Title is too long")
        String title,

        @NotNull(message = "Choose a topic")
        UUID topicId,

        @Size(max = 300, message = "The summary is too long")
        String excerpt,

        @NotBlank(message = "The post needs some content")
        @Size(max = 100_000, message = "The post is too long")
        String content,

        /** Uploads-relative path from a prior cover upload; optional. */
        @Size(max = 512, message = "Image path is too long")
        String coverImageUrl
) {}
