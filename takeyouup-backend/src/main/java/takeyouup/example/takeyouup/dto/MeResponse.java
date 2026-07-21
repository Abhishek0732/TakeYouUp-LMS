package takeyouup.example.takeyouup.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Everything the profile page needs, in one request: identity, headline
 * counters, and per-course progress. Assembling it server-side keeps the page
 * to a single round trip instead of one call per course.
 */
public record MeResponse(
        Long id,
        String name,
        String email,
        String role,
        boolean emailVerified,
        LocalDateTime joinedAt,
        Stats stats,
        List<CourseProgress> courses
) {

    public record Stats(
            long lessonsCompleted,
            long coursesInProgress,
            long coursesCompleted,
            long problemsSolved,
            long problemsTotal,
            long quizzesTaken,
            /** Mean score across every quiz attempt, as a percentage. */
            int averageQuizScore,
            long certificates
    ) {}

    public record CourseProgress(
            Long id,
            String slug,
            String title,
            String image,
            String level,
            int totalLessons,
            int completedLessons,
            int percent,
            /** Slug of the first unfinished lesson, for a "Continue" link. */
            String nextLessonSlug,
            String nextLessonTitle
    ) {}
}
