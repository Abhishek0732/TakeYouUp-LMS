package takeyouup.example.takeyouup.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.model.content.ContentItem;
import takeyouup.example.takeyouup.model.content.SiteText;
import takeyouup.example.takeyouup.repository.content.ContentItemRepository;
import takeyouup.example.takeyouup.repository.content.SiteTextRepository;

import java.util.List;

/**
 * Starter copy for every editable section, so a fresh install shows a finished
 * site rather than empty panels.
 *
 * Idempotent at two different granularities, which matters:
 *
 *  - Lists are filled per SECTION, only when that section has no rows. An admin
 *    who deletes a FAQ entry does not get it resurrected on the next restart,
 *    but a section introduced in a later release is populated automatically.
 *  - One-off text is filled per KEY, only when that key is absent. Same reason:
 *    a new headline added to a component appears without anyone touching SQL,
 *    and an edited value is never overwritten.
 *
 * This is why the seed is here and not in V9. A migration runs exactly once, so
 * anything added afterwards would silently never reach an existing database.
 *
 * Every string below is verbatim what was previously hardcoded in the React
 * components, so introducing this changes nothing on screen.
 *
 * Guarded by its OWN property, not the {@code app.seed.enabled} flag that
 * DataSeeder uses. That flag exists to switch off demo data — sample courses,
 * the demo student login — which is exactly what you would turn off in
 * production. This is not demo data: it is the site's own copy, and if it were
 * tied to the same switch, a production deploy would come up with empty feature
 * cards and a blank FAQ. Disable with {@code app.seed.content.enabled=false}.
 */
@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.content.enabled", havingValue = "true", matchIfMissing = true)
public class SiteContentSeeder implements ApplicationRunner {

    private final ContentItemRepository itemRepository;
    private final SiteTextRepository textRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedHomeFeatures();
        seedHomeSteps();
        seedHomeFaq();
        seedAboutValues();
        seedAboutReasons();
        seedAboutStory();
        seedContactInfo();
        seedContactFaq();
        seedSiteText();
    }

    /* ─────────────────────────────── helpers ─────────────────────────────── */

    /** Inserts the given rows only if the section is currently empty. */
    private void seedSection(String section, List<ContentItem> rows) {
        if (!itemRepository.findBySectionOrderBySortOrderAsc(section).isEmpty()) {
            return;
        }
        rows.forEach(r -> r.setSection(section));
        itemRepository.saveAll(rows);
        log.info("Seeded {} rows into content section {}", rows.size(), section);
    }

    private static ContentItem item(String title, String body, String icon,
                                    String link, String extra, int order) {
        return ContentItem.builder()
                .title(title).body(body).icon(icon).link(link).extra(extra)
                .sortOrder(order).active(true)
                .build();
    }

    /** Inserts a key only when it is missing, so edited values survive. */
    private void seedText(String key, String value, String description) {
        if (textRepository.findByContentKey(key).isPresent()) {
            return;
        }
        textRepository.save(SiteText.builder()
                .contentKey(key).value(value).description(description).build());
        log.info("Seeded site text key {}", key);
    }

    /* ──────────────────────────────── home ──────────────────────────────── */

    private void seedHomeFeatures() {
        seedSection("HOME_FEATURE", List.of(
                item("Structured Paths",
                        "Courses are ordered module by module, so you always know what comes next.",
                        "BookOpen", null, null, 1),
                item("Run Code In-Place",
                        "A built-in compiler for 10+ languages — try what you just read without switching tabs.",
                        "Code", null, null, 2),
                item("Practice & Quizzes",
                        "Curated problems with difficulty filters, plus a quiz at the end of each module.",
                        "Zap", null, null, 3),
                item("Progress That Sticks",
                        "Every lesson is tracked, so you can stop anywhere and pick up where you left off.",
                        "Sparkles", null, null, 4)));
    }

    private void seedHomeSteps() {
        // `extra` carries the step number printed on the card.
        seedSection("HOME_STEP", List.of(
                item("Pick a track",
                        "Choose from structured courses in DSA, Java, Python, web development, machine learning and system design. Every one is free to start — no card required.",
                        "BookOpen", null, "01", 1),
                item("Learn, then prove it",
                        "Work through lessons at your own pace, run code in the built-in compiler, and check yourself with a quiz at the end of each module.",
                        "Code", null, "02", 2),
                item("Track and finish",
                        "Your progress is saved lesson by lesson, so you can always pick up where you left off. Finish a course and claim a verifiable certificate.",
                        "Sparkles", null, "03", 3)));
    }

    private void seedHomeFaq() {
        seedSection("HOME_FAQ", List.of(
                item("Is TakeYouUp free?",
                        "Yes. Every course is free to start and there is no card required to create an account.",
                        null, null, null, 1),
                item("Do I need any prior experience?",
                        "No. The catalogue starts at complete-beginner level and each course states its level up front, so you can pick one that matches where you are.",
                        null, null, null, 2),
                item("Do I get a certificate?",
                        "Yes. Finish every lesson in a course and you can claim a certificate with a serial number anyone can verify on the site.",
                        null, null, null, 3),
                item("Can I write and run code on the site?",
                        "Yes. The online compiler supports Python, JavaScript, C++ and Java, and accepts your own standard input, so you can try what you have just read without installing anything.",
                        null, null, null, 4),
                item("Is my progress saved?",
                        "Yes. Progress is stored against your account lesson by lesson, so you can stop at any point and carry on later from any device.",
                        null, null, null, 5),
                item("What is in the resources section?",
                        "Aptitude practice — quantitative, data interpretation, logical and verbal reasoning — grouped into topics of multiple-choice questions with worked explanations.",
                        null, null, null, 6)));
    }

    /* ──────────────────────────────── about ─────────────────────────────── */

    private void seedAboutValues() {
        seedSection("ABOUT_VALUE", List.of(
                item("Our Mission",
                        "To make quality programming education accessible to everyone, regardless of their background or location. We believe in empowering individuals through knowledge.",
                        "Target", null, null, 1),
                item("Our Vision",
                        "To become the world's leading platform for learning programming, where students can transform their careers and achieve their dreams through technology.",
                        "Eye", null, null, 2),
                item("Our Values",
                        "Excellence in education, commitment to student success, innovation in teaching methods, and building a supportive learning community.",
                        "Award", null, null, 3)));
    }

    private void seedAboutReasons() {
        // Bullet list: title only, no body.
        seedSection("ABOUT_REASON", List.of(
                item("Structured courses that build in order, not scattered tutorials", null, null, null, null, 1),
                item("A built-in compiler — run code without leaving the lesson", null, null, null, null, 2),
                item("Quizzes at the end of each module to check what stuck", null, null, null, null, 3),
                item("Curated practice problems with difficulty and topic filters", null, null, null, null, 4),
                item("Progress saved lesson by lesson, so you can pick up where you left off", null, null, null, null, 5),
                item("A verifiable certificate when you finish a course", null, null, null, null, 6)));
    }

    private void seedAboutStory() {
        // Paragraphs: body only, rendered in order.
        seedSection("ABOUT_STORY", List.of(
                item(null,
                        "TakeYouUp started from a simple frustration: most programming material is either a wall of theory or a pile of disconnected tutorials, and neither gets you to the point where you can actually build something.",
                        null, null, null, 1),
                item(null,
                        "It is built and maintained by a working software engineer who wanted a place where the path is laid out end to end — read the lesson, run the code, take the quiz, solve the problems, and have your progress remembered so you can stop and come back without losing your place.",
                        null, null, null, 2),
                item(null,
                        "The catalogue covers programming fundamentals through to machine learning and system design, and it keeps growing. Everything is free to start, with no card required.",
                        null, null, null, 3)));
    }

    /* ─────────────────────────────── contact ────────────────────────────── */

    private void seedContactInfo() {
        // `body` is the visible value, `link` the href. A null link renders as
        // plain text — that is how the Location card works.
        seedSection("CONTACT_INFO", List.of(
                item("Email", "info@takeyouup.com", "Mail", "mailto:info@takeyouup.com", null, 1),
                item("Phone", "+91 6387000732", "Phone", "tel:+916387000732", null, 2),
                item("Location", "India, UP", "MapPin", null, null, 3)));
    }

    private void seedContactFaq() {
        seedSection("CONTACT_FAQ", List.of(
                item("How do I enroll in a course?",
                        "Simply browse our courses, select the one you're interested in, and start learning.",
                        null, null, null, 1),
                item("Can I access courses on mobile devices?",
                        "Absolutely! Our platform is fully responsive and works on all devices including phones and tablets.",
                        null, null, null, 2)));
    }

    /* ────────────────────────────── one-off copy ────────────────────────── */

    private void seedSiteText() {
        seedText("home.hero.badge", "New courses dropping every week",
                "Small pill above the home page headline");
        seedText("home.hero.subtitle",
                "Elevate your programming skills, solve real challenges, and unlock a world of career possibilities — one commit at a time.",
                "Paragraph under the home page headline");
        seedText("home.features.heading", "Why TakeYouUp",
                "Eyebrow label above the feature cards");
        seedText("home.steps.heading", "How it works",
                "Eyebrow label above the how-it-works steps");
        seedText("home.cta.badge", "Free to start — no card required",
                "Pill in the bottom call-to-action band");
        seedText("about.hero.subtitle",
                "We're on a mission to transform lives through quality programming education. Learn from industry experts and join a community of passionate learners.",
                "Paragraph under the About page headline");
        seedText("about.team.name", "Abhishek Verma",
                "Name shown in the About page team card");
        seedText("about.team.role", "Founder & CEO",
                "Role shown in the About page team card");
        seedText("courses.hero.subtitle",
                "Comprehensive courses designed to take you from beginner to expert. Learn at your own pace with hands-on projects.",
                "Paragraph under the Courses page headline");
        seedText("contact.hero.subtitle",
                "Have a question about a course, or something you would like to see on the site? Send us a message.",
                "Paragraph under the Contact page headline");
        seedText("footer.tagline",
                "Structured programming courses with a built-in compiler, quizzes and practice problems. Free to start.",
                "Short description in the footer");
        seedText("footer.email", "info@takeyouup.com",
                "Contact email shown in the footer bar");
    }
}
