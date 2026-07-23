package takeyouup.example.takeyouup.dto.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * What an admin sends to create or edit a blog topic.
 *
 * A DTO rather than the entity so a request can never smuggle in an id (which
 * JPA would treat as an update), a post count, or timestamps. The slug is
 * optional: left blank, the service derives one from the name.
 */
public record BlogTopicRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name is too long")
        String name,

        @Size(max = 140, message = "Slug is too long")
        String slug,

        @Size(max = 500, message = "Description is too long")
        String description,

        Integer sortOrder,

        Boolean active
) {}
