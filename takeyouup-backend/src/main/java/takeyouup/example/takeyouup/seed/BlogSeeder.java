package takeyouup.example.takeyouup.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.enums.PostStatus;
import takeyouup.example.takeyouup.enums.Role;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.blog.BlogPost;
import takeyouup.example.takeyouup.model.blog.BlogTopic;
import takeyouup.example.takeyouup.repository.UserRepository;
import takeyouup.example.takeyouup.repository.blog.BlogPostRepository;
import takeyouup.example.takeyouup.repository.blog.BlogTopicRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

/**
 * Starter content for the blog so a fresh install is not an empty page.
 *
 * Two idempotent steps, matching the granularity SiteContentSeeder uses:
 *
 *  - Topics are seeded only when the table is empty. An admin who prunes the
 *    starter list does not get it back on the next restart.
 *  - The single welcome post is seeded only when there are no posts at all, and
 *    only if an admin account exists to author it (there must be an author, and
 *    a published post an admin "wrote" is the honest attribution). Its absence
 *    is not an error — a production install with APP_SEED_ENABLED=false has no
 *    demo admin, so the post simply is not created.
 *
 * Guarded by the same {@code app.seed.content.enabled} flag as the site copy:
 * the topic categories are part of the site's own structure, not demo data, so
 * they should exist in production too. Disable with
 * {@code app.seed.content.enabled=false}.
 */
@Slf4j
@Component
@Order(3)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.content.enabled", havingValue = "true", matchIfMissing = true)
public class BlogSeeder implements ApplicationRunner {

    private final BlogTopicRepository topicRepository;
    private final BlogPostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedTopics();
        seedWelcomePost();
    }

    private void seedTopics() {
        if (topicRepository.count() > 0) {
            return;
        }
        List<String[]> topics = List.of(
                new String[]{"Data Structures & Algorithms",
                        "Problem-solving patterns, complexity, and the classics — from arrays to graphs."},
                new String[]{"Web Development",
                        "Front-end, back-end and everything that ships to a browser."},
                new String[]{"Programming Languages",
                        "Deep dives, idioms and gotchas across the languages you actually use."},
                new String[]{"Career & Interviews",
                        "Landing the role: preparation, resumes, and lessons from the other side of the table."},
                new String[]{"Machine Learning",
                        "From the maths to the models, explained without the hand-waving."}
        );
        int order = 1;
        for (String[] t : topics) {
            topicRepository.save(BlogTopic.builder()
                    .name(t[0])
                    .slug(slugify(t[0]))
                    .description(t[1])
                    .sortOrder(order++)
                    .active(true)
                    .build());
        }
        log.info("Seeded {} blog topics", topics.size());
    }

    private void seedWelcomePost() {
        if (postRepository.count() > 0) {
            return;
        }
        User admin = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .findFirst()
                .orElse(null);
        if (admin == null) {
            // No account to attribute it to — skip rather than invent an author.
            return;
        }
        BlogTopic topic = topicRepository.findAllByOrderBySortOrderAscNameAsc().stream()
                .findFirst()
                .orElse(null);
        if (topic == null) {
            return;
        }

        String content = """
                Welcome to the TakeYouUp blog — a place for the community to share what they are learning.

                ## Anyone can write here

                If you have an account, you can write a post. Head to **Write a post**, pick a topic, and put down what you know. Code is welcome — use fenced blocks and the snippets render exactly like they do in a lesson:

                ```python
                def greet(name):
                    return f"Hello, {name}!"

                print(greet("world"))
                ```

                ## How publishing works

                Every post is read by an admin before it goes live. That keeps the blog useful and spam-free. Submit your draft, and once it is approved it appears here for everyone. If it needs changes, you will see why and can resubmit.

                Happy writing.
                """;

        BlogPost post = BlogPost.builder()
                .title("Welcome to the TakeYouUp blog")
                .slug("welcome-to-the-takeyouup-blog")
                .excerpt("A place for the community to share what they are learning — written by you, "
                        + "reviewed by us, and published for everyone.")
                .content(content)
                .topic(topic)
                .author(admin)
                .status(PostStatus.PUBLISHED)
                .reviewedBy(admin)
                .reviewedAt(LocalDateTime.now())
                .publishedAt(LocalDateTime.now())
                .readMinutes(2)
                .build();
        postRepository.save(post);
        log.info("Seeded the welcome blog post");
    }

    private static String slugify(String s) {
        String base = s.toLowerCase(Locale.ROOT).trim()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return base.isBlank() ? "topic" : base;
    }
}
