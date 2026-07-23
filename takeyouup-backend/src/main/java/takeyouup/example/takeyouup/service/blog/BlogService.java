package takeyouup.example.takeyouup.service.blog;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.dto.blog.*;
import takeyouup.example.takeyouup.enums.PostStatus;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.blog.BlogPost;
import takeyouup.example.takeyouup.model.blog.BlogTopic;
import takeyouup.example.takeyouup.repository.blog.BlogPostRepository;
import takeyouup.example.takeyouup.repository.blog.BlogTopicRepository;
import takeyouup.example.takeyouup.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Everything the blog does that is not plain CRUD wiring.
 *
 * The heart of it is the {@link PostStatus} lifecycle and the ownership rules
 * around it: an author may only touch their own posts, only an admin may
 * publish, and the public may only ever read a PUBLISHED post. Those three
 * invariants are enforced here rather than trusted to the controller, so no
 * future endpoint can accidentally skip them.
 */
@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogTopicRepository topicRepository;
    private final BlogPostRepository postRepository;
    private final UserService userService;

    /**
     * How many posts one author may have waiting in the queue at once. The
     * admin gate is the real protection; this just stops a single account from
     * burying the queue under a hundred submissions in a minute.
     */
    private static final int MAX_PENDING_PER_AUTHOR = 5;

    /** Average adult reading speed; good enough for a "5 min read" badge. */
    private static final int WORDS_PER_MINUTE = 200;

    /* ─────────────────────────────── topics ─────────────────────────────── */

    /** Public menu — live topics only, each with its published-post count. */
    @Transactional(readOnly = true)
    public List<BlogTopicResponse> getPublicTopics() {
        return topicRepository.findByActiveTrueOrderBySortOrderAscNameAsc().stream()
                .map(t -> BlogTopicResponse.from(t,
                        postRepository.countByStatusAndTopic_Slug(PostStatus.PUBLISHED, t.getSlug())))
                .toList();
    }

    /** Admin list — every topic, switched off ones included. */
    @Transactional(readOnly = true)
    public List<BlogTopicResponse> getAllTopics() {
        return topicRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(t -> BlogTopicResponse.from(t,
                        postRepository.countByStatusAndTopic_Slug(PostStatus.PUBLISHED, t.getSlug())))
                .toList();
    }

    @Transactional
    public BlogTopicResponse createTopic(BlogTopicRequest req) {
        String slug = (req.slug() == null || req.slug().isBlank())
                ? uniqueTopicSlug(slugify(req.name()), null)
                : uniqueTopicSlug(slugify(req.slug()), null);
        BlogTopic topic = BlogTopic.builder()
                .name(req.name().trim())
                .slug(slug)
                .description(trimToNull(req.description()))
                .sortOrder(req.sortOrder() == null ? 0 : req.sortOrder())
                .active(req.active() == null || req.active())
                .build();
        return BlogTopicResponse.from(topicRepository.save(topic), 0);
    }

    @Transactional
    public BlogTopicResponse updateTopic(UUID id, BlogTopicRequest req) {
        BlogTopic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));
        topic.setName(req.name().trim());
        if (req.slug() != null && !req.slug().isBlank()) {
            topic.setSlug(uniqueTopicSlug(slugify(req.slug()), id));
        }
        topic.setDescription(trimToNull(req.description()));
        if (req.sortOrder() != null) topic.setSortOrder(req.sortOrder());
        if (req.active() != null) topic.setActive(req.active());
        return BlogTopicResponse.from(topicRepository.save(topic),
                postRepository.countByStatusAndTopic_Slug(PostStatus.PUBLISHED, topic.getSlug()));
    }

    @Transactional
    public void deleteTopic(UUID id) {
        BlogTopic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));
        // A topic with posts must not vanish and orphan them. Ask the admin to
        // move or remove the posts first rather than cascading a delete.
        long posts = postRepository.countByTopic_Id(id);
        if (posts > 0) {
            throw new IllegalStateException(
                    "This topic still has " + posts + " post(s). Reassign or delete them first.");
        }
        topicRepository.delete(topic);
    }

    /* ──────────────────────────── public reads ──────────────────────────── */

    @Transactional(readOnly = true)
    public Page<BlogPostCardResponse> getPublishedPosts(String topicSlug, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0), clampSize(size),
                Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<BlogPost> posts = (topicSlug == null || topicSlug.isBlank())
                ? postRepository.findByStatus(PostStatus.PUBLISHED, pageable)
                : postRepository.findByStatusAndTopic_Slug(PostStatus.PUBLISHED, topicSlug, pageable);
        return posts.map(BlogPostCardResponse::from);
    }

    @Transactional(readOnly = true)
    public BlogPostResponse getPublishedBySlug(String slug) {
        return postRepository.findBySlugAndStatus(slug, PostStatus.PUBLISHED)
                .map(BlogPostResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    /** Slugs of every published post, for the sitemap. */
    @Transactional(readOnly = true)
    public List<String> getPublishedSlugs() {
        return postRepository.findByStatus(PostStatus.PUBLISHED,
                        PageRequest.of(0, 1000, Sort.by(Sort.Direction.DESC, "publishedAt")))
                .map(BlogPost::getSlug)
                .getContent();
    }

    public long countPublished() {
        return postRepository.countByStatus(PostStatus.PUBLISHED);
    }

    /* ─────────────────────────── author actions ─────────────────────────── */

    @Transactional(readOnly = true)
    public List<BlogPostResponse> getMyPosts() {
        User me = userService.getCurrentUser();
        return postRepository.findByAuthor_IdOrderByUpdatedAtDesc(me.getId()).stream()
                .map(BlogPostResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BlogPostResponse getMyPost(UUID id) {
        return BlogPostResponse.from(ownedPost(id));
    }

    @Transactional
    public BlogPostResponse createPost(BlogPostRequest req) {
        User me = userService.getCurrentUser();
        BlogTopic topic = topicRepository.findById(req.topicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        BlogPost post = BlogPost.builder()
                .title(req.title().trim())
                .slug(uniquePostSlug(slugify(req.title())))
                .excerpt(trimToNull(req.excerpt()))
                .content(req.content())
                .coverImageUrl(trimToNull(req.coverImageUrl()))
                .topic(topic)
                .author(me)
                .status(PostStatus.DRAFT)
                .readMinutes(readingMinutes(req.content()))
                .build();
        return BlogPostResponse.from(postRepository.save(post));
    }

    @Transactional
    public BlogPostResponse updatePost(UUID id, BlogPostRequest req) {
        BlogPost post = ownedPost(id);
        BlogTopic topic = topicRepository.findById(req.topicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        post.setTitle(req.title().trim());
        post.setExcerpt(trimToNull(req.excerpt()));
        post.setContent(req.content());
        post.setCoverImageUrl(trimToNull(req.coverImageUrl()));
        post.setTopic(topic);
        post.setReadMinutes(readingMinutes(req.content()));

        // The status consequence of an edit depends on where the post was:
        //  PUBLISHED → PENDING  — a live post changed, so it must be re-approved
        //                         before the public sees the new version.
        //  REJECTED  → DRAFT    — the author is acting on the feedback; clear the
        //                         old reason and let them resubmit when ready.
        //  DRAFT / PENDING      — unchanged; a queued edit stays queued.
        switch (post.getStatus()) {
            case PUBLISHED -> post.setStatus(PostStatus.PENDING);
            case REJECTED -> {
                post.setStatus(PostStatus.DRAFT);
                post.setRejectionReason(null);
            }
            default -> { /* DRAFT and PENDING keep their status */ }
        }
        return BlogPostResponse.from(postRepository.save(post));
    }

    @Transactional
    public BlogPostResponse submitPost(UUID id) {
        BlogPost post = ownedPost(id);
        if (post.getStatus() == PostStatus.PENDING) {
            return BlogPostResponse.from(post); // already queued; nothing to do
        }
        if (post.getStatus() == PostStatus.PUBLISHED) {
            throw new IllegalStateException("This post is already published.");
        }
        User me = userService.getCurrentUser();
        long pending = postRepository.countByAuthor_IdAndStatus(me.getId(), PostStatus.PENDING);
        if (pending >= MAX_PENDING_PER_AUTHOR) {
            throw new IllegalStateException(
                    "You already have " + pending + " posts awaiting review. "
                            + "Please wait for them to be reviewed before submitting more.");
        }
        post.setStatus(PostStatus.PENDING);
        post.setRejectionReason(null);
        return BlogPostResponse.from(postRepository.save(post));
    }

    @Transactional
    public void deleteMyPost(UUID id) {
        BlogPost post = ownedPost(id);
        // A published post is public; taking it down is a moderation decision,
        // not a self-service one. The author may delete anything not yet live.
        if (post.getStatus() == PostStatus.PUBLISHED) {
            throw new IllegalStateException(
                    "A published post can only be removed by an admin.");
        }
        postRepository.delete(post);
    }

    @Transactional
    public BlogPostResponse setCover(UUID id, String uploadsRelativePath) {
        BlogPost post = ownedPost(id);
        post.setCoverImageUrl(uploadsRelativePath);
        // A cover change on a live post is cosmetic; keep the same re-review
        // rule as any other edit so the public view stays admin-vouched.
        if (post.getStatus() == PostStatus.PUBLISHED) {
            post.setStatus(PostStatus.PENDING);
        } else if (post.getStatus() == PostStatus.REJECTED) {
            post.setStatus(PostStatus.DRAFT);
            post.setRejectionReason(null);
        }
        return BlogPostResponse.from(postRepository.save(post));
    }

    /* ─────────────────────────── admin actions ──────────────────────────── */

    @Transactional(readOnly = true)
    public Page<BlogPostResponse> getPostsByStatus(PostStatus status, int page, int size) {
        // The queue is worked oldest-first (fair to whoever submitted first);
        // other statuses read newest-first, which is what a browsing admin wants.
        Sort sort = status == PostStatus.PENDING
                ? Sort.by(Sort.Direction.ASC, "updatedAt")
                : Sort.by(Sort.Direction.DESC, "updatedAt");
        Pageable pageable = PageRequest.of(Math.max(page, 0), clampSize(size), sort);
        return postRepository.findByStatus(status, pageable).map(BlogPostResponse::from);
    }

    @Transactional
    public BlogPostResponse approve(UUID id) {
        BlogPost post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User admin = userService.getCurrentUser();
        post.setStatus(PostStatus.PUBLISHED);
        post.setRejectionReason(null);
        post.setReviewedBy(admin);
        post.setReviewedAt(LocalDateTime.now());
        // Set once, on first publication, so a re-approval after an edit keeps
        // the original date rather than jumping the post to the top of the feed.
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        return BlogPostResponse.from(postRepository.save(post));
    }

    /** Admin take-down — the only way a published post leaves the site. */
    @Transactional
    public void adminDeletePost(UUID id) {
        BlogPost post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        postRepository.delete(post);
    }

    @Transactional
    public BlogPostResponse reject(UUID id, String reason) {
        BlogPost post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User admin = userService.getCurrentUser();
        post.setStatus(PostStatus.REJECTED);
        post.setRejectionReason(reason.trim());
        post.setReviewedBy(admin);
        post.setReviewedAt(LocalDateTime.now());
        return BlogPostResponse.from(postRepository.save(post));
    }

    /* ─────────────────────────────── helpers ────────────────────────────── */

    /** Loads a post and asserts the current user owns it, else 404/403. */
    private BlogPost ownedPost(UUID id) {
        BlogPost post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User me = userService.getCurrentUser();
        if (post.getAuthor() == null || !post.getAuthor().getId().equals(me.getId())) {
            throw new AccessDeniedException("This is not your post");
        }
        return post;
    }

    private int readingMinutes(String content) {
        if (content == null || content.isBlank()) return 1;
        int words = content.trim().split("\\s+").length;
        return Math.max(1, (int) Math.round((double) words / WORDS_PER_MINUTE));
    }

    private static int clampSize(int size) {
        if (size < 1) return 12;
        return Math.min(size, 50);
    }

    private static String slugify(String s) {
        String base = (s == null ? "" : s).toLowerCase(Locale.ROOT).trim()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return base.isBlank() ? "post" : base;
    }

    private String uniquePostSlug(String base) {
        String slug = base;
        int n = 2;
        while (postRepository.existsBySlug(slug)) {
            slug = base + "-" + n++;
        }
        return slug;
    }

    /** Unique among topics, ignoring the topic being edited ({@code selfId}). */
    private String uniqueTopicSlug(String base, UUID selfId) {
        String slug = base;
        int n = 2;
        while (true) {
            var existing = topicRepository.findBySlug(slug);
            if (existing.isEmpty() || existing.get().getId().equals(selfId)) {
                return slug;
            }
            slug = base + "-" + n++;
        }
    }

    private static String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
