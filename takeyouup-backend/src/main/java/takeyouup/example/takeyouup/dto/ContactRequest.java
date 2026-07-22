package takeyouup.example.takeyouup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * What a visitor may send to the contact endpoint.
 *
 * A DTO rather than binding straight onto the ContactMessage entity, and that
 * is the whole point: the entity has an {@code id}, and Spring was happily
 * binding a client-supplied one into it. Because JPA's {@code save()} treats a
 * populated id as an update, POSTing {@code {"id": 3, ...}} silently rewrote
 * message 3. Behind a login that let any registered user tamper with other
 * people's enquiries; on a public endpoint it would let anyone overwrite the
 * entire inbox. This record has no id field, so the request cannot express it.
 *
 * Validation is here too, since the entity had none — a blank name and a
 * non-address in the email column were both perfectly acceptable before.
 */
public record ContactRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name is too long")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "That does not look like an email address")
        @Size(max = 200, message = "Email is too long")
        String email,

        @NotBlank(message = "Subject is required")
        @Size(max = 200, message = "Subject is too long")
        String subject,

        @NotBlank(message = "Message is required")
        @Size(max = 5000, message = "Message is too long")
        String message,

        /**
         * Honeypot. Hidden from people by CSS and skipped by the tab order, so a
         * human never fills it in; most naive bots fill every field they find.
         * A non-empty value means "bot", and the request is dropped.
         *
         * Named `website` rather than something like `honeypot` because the name
         * is visible in the payload and an obvious one defeats the purpose.
         */
        String website
) {
    /** True when the honeypot was filled, i.e. this is almost certainly a bot. */
    public boolean looksAutomated() {
        return website != null && !website.isBlank();
    }
}
