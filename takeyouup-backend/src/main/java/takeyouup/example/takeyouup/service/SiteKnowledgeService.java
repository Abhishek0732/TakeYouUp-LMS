package takeyouup.example.takeyouup.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.service.blog.BlogService;
import takeyouup.example.takeyouup.service.dsa.DifficultyService;
import takeyouup.example.takeyouup.service.dsa.PlatformService;
import takeyouup.example.takeyouup.service.dsa.TopicService;
import takeyouup.example.takeyouup.service.resources.CategoryService;
import takeyouup.example.takeyouup.service.team.TeamService;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * Assembles a plain-text snapshot of what the site actually contains — the live
 * course list, DSA topics/platforms/difficulties, team, blog topics, resource
 * categories — plus a hand-written guide to how the site works.
 *
 * <p>The chatbot injects this into its system prompt so it can answer real
 * questions ("what courses do you offer?", "how do I get a certificate?")
 * grounded in the current database rather than a hardcoded blurb. The result is
 * cached in memory for a few minutes because it changes rarely and the chatbot
 * would otherwise re-query every table on every message.
 *
 * <p>Each section is fault-isolated: if one lookup fails, that section is simply
 * omitted and the rest of the knowledge is still returned, so the chatbot never
 * breaks because one query threw.
 */
@Service
public class SiteKnowledgeService {

    private static final Logger log = LoggerFactory.getLogger(SiteKnowledgeService.class);

    /** How long a built snapshot is reused before we rebuild it. */
    private static final long CACHE_TTL_MS = 5 * 60 * 1000L;

    private final CourseService courseService;
    private final TopicService topicService;
    private final PlatformService platformService;
    private final DifficultyService difficultyService;
    private final TeamService teamService;
    private final BlogService blogService;
    private final CategoryService categoryService;

    private volatile String cached;
    private volatile long cachedAt;

    public SiteKnowledgeService(CourseService courseService,
                                TopicService topicService,
                                PlatformService platformService,
                                DifficultyService difficultyService,
                                TeamService teamService,
                                BlogService blogService,
                                CategoryService categoryService) {
        this.courseService = courseService;
        this.topicService = topicService;
        this.platformService = platformService;
        this.difficultyService = difficultyService;
        this.teamService = teamService;
        this.blogService = blogService;
        this.categoryService = categoryService;
    }

    /** Combined live-data + static-guide knowledge, cached for {@link #CACHE_TTL_MS}. */
    public String getKnowledge() {
        long now = System.currentTimeMillis();
        String snapshot = cached;
        if (snapshot != null && (now - cachedAt) < CACHE_TTL_MS) {
            return snapshot;
        }
        snapshot = build();
        cached = snapshot;
        cachedAt = now;
        return snapshot;
    }

    private String build() {
        StringBuilder sb = new StringBuilder();

        sb.append("=== LIVE SITE DATA (current, from the database) ===\n\n");

        section(sb, "Courses offered", () -> courseService.getAllCoursesBasic().stream()
                .map(c -> "- " + safe(c.getTitle())
                        + level(c.getLevel())
                        + category(c.getCategory())
                        + description(c.getDescription()))
                .collect(Collectors.joining("\n")));

        section(sb, "Resource categories", () -> categoryService.getAllCategories().stream()
                .map(c -> safe(c.getTitle()))
                .collect(Collectors.joining(", ")));

        section(sb, "Coding-practice topics", () -> topicService.getAllTopics().stream()
                .map(t -> safe(t.getName()))
                .collect(Collectors.joining(", ")));

        section(sb, "Coding-practice platforms", () -> platformService.getAllPlatforms().stream()
                .map(p -> safe(p.getName()))
                .collect(Collectors.joining(", ")));

        section(sb, "Coding-practice difficulty levels", () -> difficultyService.getAllDifficulties().stream()
                .map(d -> safe(d.getLevel()))
                .collect(Collectors.joining(", ")));

        section(sb, "Blog topics", () -> blogService.getPublicTopics().stream()
                .map(t -> safe(t.name()))
                .collect(Collectors.joining(", ")));

        section(sb, "Team members", () -> teamService.getAll().stream()
                .map(m -> "- " + safe(m.getName())
                        + (isBlank(m.getRole()) ? "" : " — " + m.getRole().trim()))
                .collect(Collectors.joining("\n")));

        sb.append('\n').append(SITE_GUIDE);
        return sb.toString();
    }

    /**
     * Append a titled section built by {@code body}. If the body throws or comes
     * back empty, the section is skipped entirely rather than shown blank.
     */
    private void section(StringBuilder sb, String title, Supplier<String> body) {
        try {
            String content = body.get();
            if (content == null || content.isBlank()) {
                return;
            }
            sb.append(title).append(":\n").append(content).append("\n\n");
        } catch (Exception e) {
            log.warn("Skipping chatbot knowledge section '{}': {}", title, e.getMessage());
        }
    }

    private static String level(String level) {
        return isBlank(level) ? "" : " [" + level.trim() + "]";
    }

    private static String category(String category) {
        return isBlank(category) ? "" : " (" + category.trim() + ")";
    }

    private static String description(String description) {
        if (isBlank(description)) {
            return "";
        }
        String d = description.trim().replaceAll("\\s+", " ");
        if (d.length() > 140) {
            d = d.substring(0, 140).trim() + "…";
        }
        return ": " + d;
    }

    private static String safe(String s) {
        return isBlank(s) ? "(unnamed)" : s.trim();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    /**
     * The parts of the site that live in no table: navigation, how features
     * work, and what a visitor can do. Kept short and factual so the model can
     * answer "how do I …" questions without inventing steps.
     */
    private static final String SITE_GUIDE = """
            === HOW THE TAKEYOUUP SITE WORKS (guide) ===

            About TakeYouUp:
            TakeYouUp is a learning platform for programming and computer science.
            It helps beginners start coding and helps experienced developers grow,
            through structured courses, hands-on practice, quizzes and certificates.

            Accounts:
            - Visitors can browse courses, the blog and the About page without signing in.
            - To track progress, take quizzes, earn certificates or save solved problems,
              create a free account and log in from the Sign Up / Login page.

            Courses:
            - Browse all courses from the Courses page; open one to see its modules and lessons.
            - Once logged in, your progress through a course is tracked automatically.

            Coding practice (DSA problems):
            - The practice section lists curated coding problems you can filter by
              topic, platform and difficulty (see the live lists above).
            - Each problem links out to where you solve it, and you can mark it Solved
              to track what you have completed.
            - Every problem has an AI helper: "Get a hint" gives a nudge without spoiling
              the answer, and "Show solution" explains a full approach with sample code.

            Quizzes:
            - Courses include quizzes to test what you have learned; your attempts are saved
              so you can see your scores over time. (Sign-in required.)

            Certificates:
            - You can earn a certificate for completing eligible courses; issued certificates
              appear in your account.

            Resources:
            - The Resources section is organised into categories, then topics, then practice
              questions, for focused revision.

            Blog:
            - The blog has articles grouped by topic (see the live blog-topics list above).

            Contact / support:
            - Use the Contact page to send a message to the TakeYouUp team.

            The AI assistant (you):
            - You answer questions about TakeYouUp: its courses, coding practice, quizzes,
              certificates, blog, team and how to use the site.
            """;
}
