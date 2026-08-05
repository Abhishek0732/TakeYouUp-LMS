package takeyouup.example.takeyouup.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.service.ProblemAiService;
import takeyouup.example.takeyouup.util.RateLimiter;

import java.time.Duration;
import java.util.Map;

/**
 * AI study help for the practice problems: a "Get a hint" and a "Show solution"
 * button on each problem, both answered by Gemini (via {@link ProblemAiService}).
 *
 * Signed-in only — like the site chatbot ({@code POST /api/chatbot/generate}),
 * because every call spends a paid Gemini request. That gate is declared in
 * SecurityConfig; without it the blanket "POST /api/** is admin-only" rule would
 * apply. A per-IP limiter adds a second layer so a single account can't hammer
 * the model, mirroring ExecuteController.
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class ProblemAiController {

    private final ProblemAiService problemAiService;

    @Value("${app.ai.rate-limit.max-per-minute:15}")
    private int maxPerMinute;

    private volatile RateLimiter limiter;

    public ProblemAiController(ProblemAiService problemAiService) {
        this.problemAiService = problemAiService;
    }

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

    @PostMapping("/hint/{questionId}")
    public ResponseEntity<?> hint(@PathVariable Long questionId, HttpServletRequest request) {
        return respond(request, () -> problemAiService.hint(questionId));
    }

    @PostMapping("/solution/{questionId}")
    public ResponseEntity<?> solution(@PathVariable Long questionId, HttpServletRequest request) {
        return respond(request, () -> problemAiService.solution(questionId));
    }

    /**
     * Shared plumbing for both endpoints: throttle first, then call the model and
     * wrap any Gemini/transport failure in a friendly 503 instead of leaking a
     * stack trace. A missing question id throws ResourceNotFoundException, which
     * GlobalExceptionHandler already turns into a 404.
     */
    private ResponseEntity<?> respond(HttpServletRequest request, java.util.function.Supplier<String> work) {
        if (!limiter().tryAcquire(RateLimiter.clientIp(request))) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                    "message", "You're asking the AI a lot right now. Give it a moment and try again."));
        }
        try {
            String content = work.get();
            return ResponseEntity.ok(Map.of("content", content == null ? "" : content));
        } catch (RuntimeException e) {
            // Let ResourceNotFoundException fall through to the global handler (404).
            if (e instanceof takeyouup.example.takeyouup.exception.ResourceNotFoundException) {
                throw e;
            }
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "message", "The AI helper is unavailable right now. Please try again shortly."));
        }
    }
}
