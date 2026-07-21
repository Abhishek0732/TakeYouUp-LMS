package takeyouup.example.takeyouup.exception;

/**
 * Thrown at login when {@code app.auth.require-verified-email} is on and the
 * account has not confirmed its address yet. Kept separate from
 * AccessDeniedException so the reason survives to the client.
 */
public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
