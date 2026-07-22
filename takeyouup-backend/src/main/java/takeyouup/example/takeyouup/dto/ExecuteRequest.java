package takeyouup.example.takeyouup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * A request to run a snippet.
 *
 * The language arrives as a NAME, never as a Judge0 numeric id: the mapping
 * lives on the server so a client cannot ask for an arbitrary runtime, and so
 * adding a language does not require a frontend release.
 */
public record ExecuteRequest(

        @NotBlank(message = "Language is required")
        @Size(max = 32)
        String language,

        @NotBlank(message = "There is no code to run")
        // Generous, but bounded — this is forwarded to a third party and cached.
        @Size(max = 60_000, message = "That snippet is too long to run here")
        String code,

        @Size(max = 10_000, message = "That input is too long")
        String stdin
) {
    public String safeStdin() {
        return stdin == null ? "" : stdin;
    }
}
