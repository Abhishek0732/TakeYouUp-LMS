package takeyouup.example.takeyouup.dto;

import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.CourseModule;
import takeyouup.example.takeyouup.model.Lesson;

import java.util.List;

/**
 * The publicly visible shape of a course: enough to decide whether to enrol,
 * and nothing more.
 *
 * Course pages used to sit entirely behind ProtectedRoute, which meant a
 * signed-out visitor — and every search engine crawler — was redirected to the
 * sign-in page. For a learning platform the courses ARE the content, so none of
 * it could be found. This DTO is what makes the overview safe to serve
 * anonymously: it carries the syllabus structure (module titles, lesson titles
 * and slugs, counts) but deliberately omits {@link Lesson#getContent()} and the
 * lesson key points, which stay behind {@code /api/courses/slug/{slug}}.
 *
 * Enrolment count and rating are also left out. They exist as columns but hold
 * seeded values, and the frontend stopped displaying them for the same reason.
 */
public record CourseOverviewDTO(
        Long id,
        String slug,
        String title,
        String description,
        String category,
        String level,
        String duration,
        String image,
        String instructor,
        String price,
        int moduleCount,
        int lessonCount,
        List<ModuleOutline> modules
) {

    /** A module's title and the titles of the lessons inside it — no bodies. */
    public record ModuleOutline(String title, List<LessonOutline> lessons) {
    }

    /**
     * Title, slug and duration only. The slug is included so the page can link
     * to the lesson; following that link still requires an account.
     */
    public record LessonOutline(String title, String slug, String duration) {
    }

    public static CourseOverviewDTO from(Course course) {
        List<CourseModule> modules = course.getModules() == null ? List.of() : course.getModules();

        List<ModuleOutline> outline = modules.stream()
                .map(module -> new ModuleOutline(
                        module.getTitle(),
                        (module.getLessons() == null ? List.<Lesson>of() : module.getLessons()).stream()
                                .map(lesson -> new LessonOutline(
                                        lesson.getTitle(),
                                        lesson.getSlug(),
                                        lesson.getDuration()))
                                .toList()))
                .toList();

        int lessons = outline.stream().mapToInt(m -> m.lessons().size()).sum();

        return new CourseOverviewDTO(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getLevel(),
                course.getDuration(),
                // getImageUrl(), not getImage(): the raw column holds a bare
                // "courses/<uuid>.jpg", and the browser needs the "/uploads/"
                // prefix that this getter adds.
                course.getImageUrl(),
                course.getInstructor(),
                course.getPrice(),
                outline.size(),
                lessons,
                outline);
    }
}
