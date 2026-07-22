package takeyouup.example.takeyouup.util;

import jakarta.servlet.http.HttpServletRequest;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A small fixed-window rate limiter keyed by client IP.
 *
 * Needed because the contact form is now open to anyone: an unauthenticated
 * write endpoint with no throttle is an invitation to fill the table.
 *
 * Deliberately in-memory. The app runs as a single instance, so a shared store
 * would be complexity without benefit — but that is exactly why it is worth
 * saying out loud: run more than one replica and each gets its own allowance,
 * so this needs to move to Redis before horizontal scaling.
 */
public class RateLimiter {

    /** Sweep stale buckets once every this many calls — see {@link #tryAcquire}. */
    private static final int SWEEP_EVERY = 500;

    private final int maxRequests;
    private final Duration window;
    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();
    private final java.util.concurrent.atomic.AtomicInteger callsSinceSweep =
            new java.util.concurrent.atomic.AtomicInteger();

    public RateLimiter(int maxRequests, Duration window) {
        this.maxRequests = maxRequests;
        this.window = window;
    }

    /**
     * Records an attempt and reports whether it is allowed.
     * Synchronised per key so two concurrent requests cannot both slip past the
     * limit by reading the deque before either has written to it.
     */
    public boolean tryAcquire(String key) {
        // Housekeeping rides along with normal traffic rather than on a
        // @Scheduled method: the application does not enable scheduling, so an
        // annotated sweeper would never have run and the map would have grown
        // for the life of the process.
        if (callsSinceSweep.incrementAndGet() >= SWEEP_EVERY) {
            callsSinceSweep.set(0);
            evictStale();
        }

        Instant now = Instant.now();
        Instant cutoff = now.minus(window);

        Deque<Instant> timestamps = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= maxRequests) {
                return false;
            }
            timestamps.addLast(now);
            return true;
        }
    }

    /**
     * Best-effort client address.
     *
     * The app sits behind nginx, so the socket address is always the proxy's.
     * X-Forwarded-For's first entry is the original client — spoofable in
     * general, but our own proxy appends to it, and the fallback is the remote
     * address, so the worst case is a shared bucket rather than no limit.
     */
    public static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Drops buckets with nothing left in the window, so the map cannot grow
     * without bound across a long uptime.
     */
    public void evictStale() {
        Instant cutoff = Instant.now().minus(window);
        hits.entrySet().removeIf(entry -> {
            Deque<Instant> timestamps = entry.getValue();
            synchronized (timestamps) {
                while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                    timestamps.pollFirst();
                }
                return timestamps.isEmpty();
            }
        });
    }
}
