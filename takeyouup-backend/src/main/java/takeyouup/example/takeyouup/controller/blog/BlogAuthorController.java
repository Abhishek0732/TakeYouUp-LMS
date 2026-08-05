package takeyouup.example.takeyouup.controller.blog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import takeyouup.example.takeyouup.dto.blog.BlogPostRequest;
import takeyouup.example.takeyouup.dto.blog.BlogPostResponse;
import takeyouup.example.takeyouup.service.FileStorageService;
import takeyouup.example.takeyouup.service.blog.BlogService;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * The writer's side of the blog: an author managing their own posts.
 *
 * Everything is under {@code /api/blog/me/**}, which SecurityConfig marks
 * {@code authenticated()} — so any signed-in USER reaches it, ahead of the
 * blanket "POST/PUT/DELETE to /api/** is admin-only" rule. The service checks
 * ownership on every post, so being signed in lets you manage YOUR posts, not
 * anyone else's.
 */
@RestController
@RequestMapping("/api/blog/me")
@RequiredArgsConstructor
@CrossOrigin
public class BlogAuthorController {

    private final BlogService blogService;
    private final FileStorageService fileStorageService;

    /** The author's dashboard — all their posts, any status. */
    @GetMapping("/posts")
    public List<BlogPostResponse> myPosts() {
        return blogService.getMyPosts();
    }

    /** One of the author's own posts, for the editor to load. */
    @GetMapping("/posts/{id}")
    public BlogPostResponse myPost(@PathVariable UUID id) {
        return blogService.getMyPost(id);
    }

    @PostMapping("/posts")
    public ResponseEntity<BlogPostResponse> create(@Valid @RequestBody BlogPostRequest req) {
        return ResponseEntity.status(201).body(blogService.createPost(req));
    }

    @PutMapping("/posts/{id}")
    public BlogPostResponse update(@PathVariable UUID id, @Valid @RequestBody BlogPostRequest req) {
        return blogService.updatePost(id, req);
    }

    /** Send a draft (or a rejected post) into the admin review queue. */
    @PostMapping("/posts/{id}/submit")
    public BlogPostResponse submit(@PathVariable UUID id) {
        return blogService.submitPost(id);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        blogService.deleteMyPost(id);
        return ResponseEntity.noContent().build();
    }

    /** Upload or replace the cover image for one of the author's own posts. */
    @PostMapping("/posts/{id}/cover")
    public ResponseEntity<?> uploadCover(@PathVariable UUID id,
                                         @RequestPart("image") MultipartFile file) {
        try {
            String stored = fileStorageService.storeImage(file, "blog");
            BlogPostResponse post = blogService.setCover(id, FileStorageService.publicUrl(stored));
            return ResponseEntity.ok(post);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not store the image");
        }
    }

    /**
     * Store an image for use INSIDE a post body and hand back its URL.
     *
     * Unlike the cover upload this is not tied to a post — the editor calls it
     * the moment a writer picks an image, before the draft may even have an id,
     * and drops the returned URL into the Markdown as {@code ![](url)}. Same
     * size/type limits as every other upload (FileStorageService), and it lives
     * under {@code /api/blog/me/**}, so a sign-in is required.
     */
    @PostMapping("/images")
    public ResponseEntity<?> uploadInlineImage(@RequestPart("image") MultipartFile file) {
        try {
            String stored = fileStorageService.storeImage(file, "blog");
            return ResponseEntity.ok(Map.of("url", FileStorageService.publicUrl(stored)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not store the image");
        }
    }
}
