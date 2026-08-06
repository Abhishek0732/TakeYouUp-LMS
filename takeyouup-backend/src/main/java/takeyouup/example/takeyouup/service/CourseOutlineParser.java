package takeyouup.example.takeyouup.service;

import takeyouup.example.takeyouup.model.CourseModule;
import takeyouup.example.takeyouup.model.KeyPoint;
import takeyouup.example.takeyouup.model.Lesson;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Turns a plain-text course outline into a module/lesson tree that can be saved
 * in one request, so an admin can paste a whole module (or several) at once
 * instead of clicking through the editor lesson by lesson.
 *
 * <h3>Format</h3>
 * <pre>
 * # Module: Introduction
 * ## Lesson: What is Java | 10 min
 * Java is a general-purpose language...      &lt;- prose = lesson content (markdown)
 * more content on the next line...
 * - Runs on the JVM                          &lt;- "- " lines = key points
 * - Write once, run anywhere :: thanks to bytecode   &lt;- optional "point :: explanation"
 *
 * ## Lesson: Setup | 15 min
 * Install the JDK...
 * - Set JAVA_HOME
 *
 * # Module: Basics
 * ## Lesson: Variables | 8 min
 * ...
 * </pre>
 *
 * <p>The literal keywords {@code Module:} and {@code Lesson:} are what mark a new
 * heading, so ordinary Markdown headings inside lesson content (e.g. an
 * {@code ## Overview}) are left untouched. The {@code | duration} on a lesson
 * line is optional. Bullet lines directly under a lesson are treated as key
 * points; put bullet lists you want to keep as content inside a sentence.
 */
public final class CourseOutlineParser {

    private CourseOutlineParser() {
    }

    public static List<CourseModule> parse(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Nothing to import — the outline is empty.");
        }

        List<CourseModule> modules = new ArrayList<>();
        CourseModule currentModule = null;
        Lesson currentLesson = null;
        StringBuilder content = null;   // content for the current lesson

        String[] lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n", -1);
        for (String raw : lines) {
            String line = raw.strip();

            String moduleTitle = heading(line, "#", "Module:");
            String lessonHeading = heading(line, "##", "Lesson:");

            if (moduleTitle != null) {
                flushContent(currentLesson, content);
                content = null;
                currentModule = new CourseModule();
                currentModule.setTitle(moduleTitle);
                currentModule.setLessons(new ArrayList<>());
                modules.add(currentModule);
                currentLesson = null;
            } else if (lessonHeading != null) {
                if (currentModule == null) {
                    throw new IllegalArgumentException(
                            "Found a lesson before any module. Start with a line like "
                                    + "\"# Module: <title>\" before adding lessons.");
                }
                flushContent(currentLesson, content);
                currentLesson = newLesson(lessonHeading);
                currentModule.getLessons().add(currentLesson);
                content = new StringBuilder();
            } else if (isBullet(line) && currentLesson != null) {
                currentLesson.getKeyPoints().add(keyPoint(line));
            } else if (!line.isEmpty() && currentLesson != null) {
                if (content == null) {
                    content = new StringBuilder();
                }
                if (content.length() > 0) {
                    content.append('\n');
                }
                content.append(line);
            }
            // Non-empty lines before the first lesson (module descriptions) have
            // nowhere to live in the model, so they are quietly ignored.
        }
        flushContent(currentLesson, content);

        if (modules.isEmpty()) {
            throw new IllegalArgumentException(
                    "No modules found. Use \"# Module: <title>\" and \"## Lesson: <title>\" lines.");
        }
        return modules;
    }

    /**
     * If {@code line} is a heading of the form {@code <hashes> <keyword> <title>}
     * (case-insensitive keyword), return the trimmed title; otherwise null.
     */
    private static String heading(String line, String hashes, String keyword) {
        if (!line.startsWith("#")) {
            return null;
        }
        // strip leading hashes and spaces
        int i = 0;
        while (i < line.length() && line.charAt(i) == '#') {
            i++;
        }
        // exactly the right heading level: number of hashes must match
        if (i != hashes.length()) {
            return null;
        }
        String rest = line.substring(i).strip();
        if (rest.toLowerCase(Locale.ROOT).startsWith(keyword.toLowerCase(Locale.ROOT))) {
            String title = rest.substring(keyword.length()).strip();
            return title.isEmpty() ? null : title;
        }
        return null;
    }

    private static Lesson newLesson(String heading) {
        String title = heading;
        String duration = null;
        int bar = heading.indexOf('|');
        if (bar >= 0) {
            title = heading.substring(0, bar).strip();
            duration = heading.substring(bar + 1).strip();
            if (duration.isEmpty()) {
                duration = null;
            }
        }
        if (title.isEmpty()) {
            throw new IllegalArgumentException("A lesson is missing its title (\"## Lesson: <title>\").");
        }
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setSlug(slugify(title));
        lesson.setDuration(duration);
        lesson.setKeyPoints(new ArrayList<>());
        return lesson;
    }

    private static boolean isBullet(String line) {
        return line.startsWith("- ") || line.startsWith("* ")
                || line.equals("-") || line.equals("*");
    }

    private static KeyPoint keyPoint(String line) {
        String body = line.substring(1).strip();   // drop the leading - or *
        String point = body;
        String explanation = null;
        int sep = body.indexOf("::");
        if (sep >= 0) {
            point = body.substring(0, sep).strip();
            explanation = body.substring(sep + 2).strip();
            if (explanation.isEmpty()) {
                explanation = null;
            }
        }
        KeyPoint kp = new KeyPoint();
        kp.setPoint(point);
        kp.setExplanation(explanation);
        return kp;
    }

    private static void flushContent(Lesson lesson, StringBuilder content) {
        if (lesson != null && content != null && content.length() > 0) {
            lesson.setContent(content.toString().strip());
        }
    }

    private static String slugify(String title) {
        String slug = title.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+)|(-+$)", "");
        return slug.isEmpty() ? "lesson" : slug;
    }
}
