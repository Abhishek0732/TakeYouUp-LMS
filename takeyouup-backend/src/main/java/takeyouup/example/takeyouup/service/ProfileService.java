package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.dto.MeResponse;
import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.UserProgress;
import takeyouup.example.takeyouup.model.quiz.QuizAttempt;
import takeyouup.example.takeyouup.repository.CertificateRepository;
import takeyouup.example.takeyouup.repository.CourseRepository;
import takeyouup.example.takeyouup.repository.LessonRepository;
import takeyouup.example.takeyouup.repository.UserProgressRepository;
import takeyouup.example.takeyouup.repository.dsa.QuestionRepository;
import takeyouup.example.takeyouup.repository.quiz.QuizAttemptRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Assembles the profile page payload.
 *
 * Cost is a fixed handful of queries no matter how many courses or lessons
 * exist — the per-course progress is computed in memory from one progress
 * read and one lesson projection, rather than a summary call per course.
 */
@Service
@RequiredArgsConstructor
public class ProfileService {

    private static final String LESSON = "LESSON";
    private static final String QUESTION = "QUESTION";

    private final UserService userService;
    private final UserProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CertificateRepository certificateRepository;

    @Transactional(readOnly = true)
    public MeResponse getCurrentUserProfile() {
        User user = userService.getCurrentUser();

        // Lessons are tracked by slug in some places and id in others, so keep
        // both keys and match on either.
        Set<String> completed = new HashSet<>();
        long problemsSolved = 0;
        for (UserProgress p : progressRepository.findByUser(user)) {
            if (!p.isCompleted()) {
                continue;
            }
            if (LESSON.equals(p.getItemType())) {
                completed.add(p.getItemId());
            } else if (QUESTION.equals(p.getItemType())) {
                problemsSolved++;
            }
        }

        Map<Long, List<Object[]>> lessonsByCourse = new LinkedHashMap<>();
        for (Object[] row : lessonRepository.findAllLessonRows()) {
            lessonsByCourse.computeIfAbsent((Long) row[0], k -> new ArrayList<>()).add(row);
        }

        List<MeResponse.CourseProgress> courses = new ArrayList<>();
        long inProgress = 0;
        long finished = 0;
        long lessonsDone = 0;

        for (Course course : courseRepository.findAll()) {
            List<Object[]> lessons = lessonsByCourse.getOrDefault(course.getId(), List.of());
            int total = lessons.size();
            int done = 0;
            String nextSlug = null;
            String nextTitle = null;

            for (Object[] lesson : lessons) {
                String slug = (String) lesson[2];
                String id = String.valueOf(lesson[1]);
                if (completed.contains(slug) || completed.contains(id)) {
                    done++;
                } else if (nextSlug == null) {
                    nextSlug = slug;
                    nextTitle = (String) lesson[3];
                }
            }

            if (done == 0) {
                continue;   // never started — not part of "my learning"
            }

            lessonsDone += done;
            if (done >= total) {
                finished++;
            } else {
                inProgress++;
            }

            courses.add(new MeResponse.CourseProgress(
                    course.getId(),
                    course.getSlug(),
                    course.getTitle(),
                    course.getImageUrl(),
                    course.getLevel(),
                    total,
                    done,
                    total == 0 ? 0 : (int) Math.round((done * 100.0) / total),
                    nextSlug,
                    nextTitle
            ));
        }

        // Most-progressed first so "continue learning" is at the top.
        courses.sort((a, b) -> Integer.compare(b.percent(), a.percent()));

        List<QuizAttempt> attempts = quizAttemptRepository.findByUserOrderByCreatedAtDesc(user);
        int averageQuizScore = 0;
        if (!attempts.isEmpty()) {
            double sum = attempts.stream()
                    .mapToDouble(a -> a.getTotal() == 0 ? 0 : (a.getScore() * 100.0) / a.getTotal())
                    .sum();
            averageQuizScore = (int) Math.round(sum / attempts.size());
        }

        MeResponse.Stats stats = new MeResponse.Stats(
                lessonsDone,
                inProgress,
                finished,
                problemsSolved,
                questionRepository.count(),
                attempts.size(),
                averageQuizScore,
                certificateRepository.findByUser(user).size()
        );

        return new MeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() == null ? null : user.getRole().name(),
                user.isEmailVerified(),
                user.getCreatedAt(),
                stats,
                courses
        );
    }
}
