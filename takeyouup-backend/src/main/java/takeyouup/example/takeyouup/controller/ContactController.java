package takeyouup.example.takeyouup.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.ContactRequest;
import takeyouup.example.takeyouup.model.ContactMessage;
import takeyouup.example.takeyouup.service.ContactMessageService;
import takeyouup.example.takeyouup.util.RateLimiter;

import java.time.Duration;
import java.util.Map;

/**
 * The public contact form.
 *
 * Open to anyone. It used to require an account, which meant the one visitor
 * most worth hearing from — someone with a question they want answered *before*
 * signing up — was the one person who could not ask it.
 *
 * Opening it brought three things that had to be dealt with first:
 *
 *  1. The endpoint bound straight onto the ContactMessage entity, so a client
 *     could supply an {@code id}; JPA treats a populated id as an update, so
 *     POSTing an existing one rewrote that message. {@link ContactRequest} has
 *     no id field, so the request cannot express it.
 *  2. There was no validation at all — blank names and non-addresses were
 *     stored happily. The DTO carries constraints and {@code @Valid} enforces
 *     them.
 *  3. An unauthenticated write endpoint needs a throttle and some bot
 *     resistance, hence the rate limiter and the honeypot field.
 */
@Slf4j
@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactController {

    @Autowired
    private ContactMessageService contactMessageService;

    @Value("${app.contact.rate-limit.max-per-hour:5}")
    private int maxPerHour;

    private volatile RateLimiter limiter;

    /** Built lazily so the configured value is injected before first use. */
    private RateLimiter limiter() {
        RateLimiter local = limiter;
        if (local == null) {
            synchronized (this) {
                local = limiter;
                if (local == null) {
                    local = new RateLimiter(maxPerHour, Duration.ofHours(1));
                    limiter = local;
                }
            }
        }
        return local;
    }

    @PostMapping
    public ResponseEntity<?> submit(@Valid @RequestBody ContactRequest request,
                                    HttpServletRequest servletRequest) {

        // Honeypot: answer exactly as if it had worked. Telling a bot it was
        // detected only invites a retry with the field left blank.
        if (request.looksAutomated()) {
            log.debug("Dropped a contact submission that filled the honeypot");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Thanks — your message has been sent."));
        }

        String ip = RateLimiter.clientIp(servletRequest);
        if (!limiter().tryAcquire(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message",
                            "You have sent several messages already. Please try again later."));
        }

        // Built field by field, never from the request object, so nothing the
        // client sends can reach a column that is not listed here.
        ContactMessage entity = new ContactMessage();
        entity.setName(request.name().trim());
        entity.setEmail(request.email().trim());
        entity.setSubject(request.subject().trim());
        entity.setMessage(request.message().trim());
        // id is deliberately left null so JPA inserts; createdAt keeps the
        // entity's own default.
        ContactMessage saved = contactMessageService.saveContactMessage(entity);

        // An acknowledgement, not the row: echoing the entity back handed its
        // database id to an anonymous caller for no reason.
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", saved.getId(),
                        "message", "Thanks — your message has been sent."));
    }
}
