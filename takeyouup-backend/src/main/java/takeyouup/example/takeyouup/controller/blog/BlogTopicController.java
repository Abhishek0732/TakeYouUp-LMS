package takeyouup.example.takeyouup.controller.blog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.blog.BlogTopicRequest;
import takeyouup.example.takeyouup.dto.blog.BlogTopicResponse;
import takeyouup.example.takeyouup.service.blog.BlogService;

import java.util.List;
import java.util.UUID;

/**
 * Blog topics.
 *
 * The public GET is what the blog landing page and its filter chips read. The
 * admin CRUD lives under {@code /api/blog/admin/topics}, which SecurityConfig
 * pins to ROLE_ADMIN — so the create/update/delete verbs here are only reachable
 * by staff even though they sit in the same controller.
 */
@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
@CrossOrigin
public class BlogTopicController {

    private final BlogService blogService;

    /** Public — active topics with their published-post counts. */
    @GetMapping("/topics")
    public List<BlogTopicResponse> getPublicTopics() {
        return blogService.getPublicTopics();
    }

    /** Admin — every topic, including hidden ones. */
    @GetMapping("/admin/topics")
    public List<BlogTopicResponse> getAllTopics() {
        return blogService.getAllTopics();
    }

    @PostMapping("/admin/topics")
    public ResponseEntity<BlogTopicResponse> create(@Valid @RequestBody BlogTopicRequest req) {
        return ResponseEntity.status(201).body(blogService.createTopic(req));
    }

    @PutMapping("/admin/topics/{id}")
    public BlogTopicResponse update(@PathVariable UUID id, @Valid @RequestBody BlogTopicRequest req) {
        return blogService.updateTopic(id, req);
    }

    @DeleteMapping("/admin/topics/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        blogService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}
