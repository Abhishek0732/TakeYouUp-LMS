package takeyouup.example.takeyouup.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import takeyouup.example.takeyouup.exception.TooManyRequestsException;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory login throttle: after too many failed attempts for a given
 * key (email) within a window, further attempts are rejected with HTTP 429 until
 * the window elapses. A successful login resets the counter.
 *
 * Good enough for a single instance; behind multiple instances use a shared
 * store (Redis) or an edge rate limiter.
 */
@Component
public class LoginRateLimiter {

    @Value("${app.security.login.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.security.login.window-minutes:15}")
    private long windowMinutes;

    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    public void checkAllowed(String key) {
        Attempt attempt = attempts.get(normalize(key));
        if (attempt == null) {
            return;
        }
        if (isExpired(attempt)) {
            attempts.remove(normalize(key));
            return;
        }
        if (attempt.count >= maxAttempts) {
            throw new TooManyRequestsException(
                    "Too many login attempts. Please try again in a few minutes.");
        }
    }

    public void recordFailure(String key) {
        String k = normalize(key);
        attempts.compute(k, (ignored, existing) -> {
            if (existing == null || isExpired(existing)) {
                return new Attempt(1, Instant.now());
            }
            existing.count++;
            return existing;
        });
    }

    public void reset(String key) {
        attempts.remove(normalize(key));
    }

    private boolean isExpired(Attempt attempt) {
        return attempt.firstAttempt.plus(Duration.ofMinutes(windowMinutes)).isBefore(Instant.now());
    }

    private String normalize(String key) {
        return key == null ? "" : key.trim().toLowerCase();
    }

    private static final class Attempt {
        int count;
        final Instant firstAttempt;

        Attempt(int count, Instant firstAttempt) {
            this.count = count;
            this.firstAttempt = firstAttempt;
        }
    }
}
