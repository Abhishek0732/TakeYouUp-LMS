package takeyouup.example.takeyouup.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.ExecuteRequest;
import takeyouup.example.takeyouup.dto.ExecuteResponse;
import takeyouup.example.takeyouup.service.CodeExecutionService;
import takeyouup.example.takeyouup.util.RateLimiter;

import java.time.Duration;
import java.util.Map;
import java.util.Set;

/**
 * Runs code on the learner's behalf.
 *
 * Public, because the compiler page is reachable without an account and the Run
 * button on a lesson snippet should not be the thing that demands one. That
 * makes it an unauthenticated call to a paid third party, so it is rate limited
 * per IP — and the service caches identical runs, which is what actually keeps
 * the volume down for lesson snippets.
 */
@RestController
@RequestMapping("/api/execute")
@CrossOrigin
public class ExecuteController {

    @Autowired
    private CodeExecutionService executionService;

    @Value("${app.execute.rate-limit.max-per-minute:20}")
    private int maxPerMinute;

    private volatile RateLimiter limiter;

    private RateLimiter limiter() {
        RateLimiter local = limiter;
        if (local == null) {
            synchronized (this) {
                local = limiter;
                if (local == null) {
                    local = new RateLimiter(maxPerMinute, Duration.ofMinutes(1));
                    limiter = local;
                }
            }
        }
        return local;
    }

    @PostMapping
    public ResponseEntity<?> execute(@Valid @RequestBody ExecuteRequest request,
                                     HttpServletRequest servletRequest) {

        if (!executionService.supports(request.language())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "That language cannot be run here.",
                    "supported", executionService.supportedLanguages()));
        }

        if (!limiter().tryAcquire(RateLimiter.clientIp(servletRequest))) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                    "message", "You are running code very quickly. Give it a moment and try again."));
        }

        ExecuteResponse response = executionService.run(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Which languages carry a Run button.
     *
     * The frontend asks rather than hardcoding a list, so the two cannot drift:
     * a snippet tagged with a language the runner does not support simply gets
     * no button instead of one that always fails.
     */
    @GetMapping("/languages")
    public ResponseEntity<Set<String>> languages() {
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=3600")
                .body(executionService.supportedLanguages());
    }
}
