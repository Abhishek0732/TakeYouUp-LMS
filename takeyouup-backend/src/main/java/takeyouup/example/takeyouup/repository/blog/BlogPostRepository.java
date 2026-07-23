package takeyouup.example.takeyouup.repository.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.enums.PostStatus;
import takeyouup.example.takeyouup.model.blog.BlogPost;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {

    /** Public detail lookup — a slug only resolves when the post is published. */
    Optional<BlogPost> findBySlugAndStatus(String slug, PostStatus status);

    boolean existsBySlug(String slug);

    /** Public listing (all topics) and the admin review queue both use this. */
    Page<BlogPost> findByStatus(PostStatus status, Pageable pageable);

    /** Public listing, one topic. */
    Page<BlogPost> findByStatusAndTopic_Slug(PostStatus status, String topicSlug, Pageable pageable);

    /** The author's own dashboard — every status they own. */
    List<BlogPost> findByAuthor_IdOrderByUpdatedAtDesc(Long authorId);

    /** Guards the per-author pending cap. */
    long countByAuthor_IdAndStatus(Long authorId, PostStatus status);

    /** Public catalogue count for the marketing stats endpoint. */
    long countByStatus(PostStatus status);

    /** Published-post count for one topic — the "12 articles" badge. */
    long countByStatusAndTopic_Slug(PostStatus status, String topicSlug);

    /** Blocks deleting a topic that still owns posts. */
    long countByTopic_Id(UUID topicId);
}
