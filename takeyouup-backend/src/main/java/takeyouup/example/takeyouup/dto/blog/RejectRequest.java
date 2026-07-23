package takeyouup.example.takeyouup.dto.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * The reason an admin gives when turning a post down. Required — a rejection the
 * author cannot act on is worse than none, so the reason is not optional.
 */
public record RejectRequest(

        @NotBlank(message = "Give the author a reason")
        @Size(max = 1000, message = "Reason is too long")
        String reason
) {}
