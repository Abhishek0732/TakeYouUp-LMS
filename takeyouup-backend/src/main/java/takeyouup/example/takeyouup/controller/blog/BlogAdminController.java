package takeyouup.example.takeyouup.controller.blog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.blog.BlogPostResponse;
import takeyouup.example.takeyouup.dto.blog.RejectRequest;
import takeyouup.example.takeyouup.enums.PostStatus;
import takeyouup.example.takeyouup.service.blog.BlogService;

import java.util.UUID;

/**
 * The moderation side of the blog.
 *
 * All of it sits under {@code /api/blog/admin/**}, which SecurityConfig pins to
 * ROLE_ADMIN. This is where a post becomes public: nothing an author does can
 * reach PUBLISHED without an approve() call from here.
 */
@RestController
@RequestMapping("/api/blog/admin")
@RequiredArgsConstructor
@CrossOrigin
public class BlogAdminController {

    private final BlogService blogService;

    /** The review queue — defaults to PENDING, the posts awaiting a decision. */
    @GetMapping("/posts")
    public Page<BlogPostResponse> byStatus(
            @RequestParam(defaultValue = "PENDING") PostStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return blogService.getPostsByStatus(status, page, size);
    }

    @PostMapping("/posts/{id}/approve")
    public BlogPostResponse approve(@PathVariable UUID id) {
        return blogService.approve(id);
    }

    @PostMapping("/posts/{id}/reject")
    public BlogPostResponse reject(@PathVariable UUID id, @Valid @RequestBody RejectRequest req) {
        return blogService.reject(id, req.reason());
    }

    /** Take a post down entirely — the admin counterpart to an author's delete,
     *  and the only route by which a published post can be removed. */
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        blogService.adminDeletePost(id);
        return ResponseEntity.noContent().build();
    }
}
