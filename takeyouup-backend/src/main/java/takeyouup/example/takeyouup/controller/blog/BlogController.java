package takeyouup.example.takeyouup.controller.blog;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.blog.BlogPostCardResponse;
import takeyouup.example.takeyouup.dto.blog.BlogPostResponse;
import takeyouup.example.takeyouup.service.blog.BlogService;

/**
 * The public blog: the reader's view.
 *
 * Every endpoint here serves only PUBLISHED posts — the service enforces that,
 * not the controller, so a slug for a draft or a post still in review resolves
 * to a 404 exactly as if it did not exist. Nothing here needs an account.
 */
@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
@CrossOrigin
public class BlogController {

    private final BlogService blogService;

    /** A page of published posts, newest first, optionally filtered by topic. */
    @GetMapping("/posts")
    public Page<BlogPostCardResponse> list(
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return blogService.getPublishedPosts(topic, page, size);
    }

    /** One published post in full, by slug. */
    @GetMapping("/posts/{slug}")
    public BlogPostResponse getBySlug(@PathVariable String slug) {
        return blogService.getPublishedBySlug(slug);
    }
}
