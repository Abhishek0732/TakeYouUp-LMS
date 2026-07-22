package takeyouup.example.takeyouup.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import takeyouup.example.takeyouup.repository.CourseRepository;
import takeyouup.example.takeyouup.repository.LessonRepository;
import takeyouup.example.takeyouup.repository.dsa.QuestionRepository;
import takeyouup.example.takeyouup.repository.resources.McqQuestionRepository;
import takeyouup.example.takeyouup.repository.resources.ResourceCategoryRepository;
import takeyouup.example.takeyouup.repository.resources.ResourceTopicRepository;

import java.util.Map;

/**
 * Public catalogue counts for the marketing pages.
 *
 * These exist so the landing and about pages can state real, checkable figures
 * instead of hardcoded ones. Everything here is a count of published content —
 * deliberately NOT user or enrolment counts, which are private and which a young
 * product has no business advertising.
 *
 * Counts are cheap (indexed COUNT(*)) and the numbers move slowly, so the
 * response is marked cacheable for a few minutes rather than hitting the DB on
 * every homepage view.
 */
@RestController
@RequestMapping("/api/stats")
@CrossOrigin
public class StatsController {

    @Autowired private CourseRepository courseRepository;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private McqQuestionRepository mcqQuestionRepository;
    @Autowired private ResourceCategoryRepository resourceCategoryRepository;
    @Autowired private ResourceTopicRepository resourceTopicRepository;

    @GetMapping
    public ResponseEntity<Map<String, Long>> stats() {
        Map<String, Long> body = Map.of(
                "courses", courseRepository.count(),
                "lessons", lessonRepository.count(),
                "practiceProblems", questionRepository.count(),
                "quizQuestions", mcqQuestionRepository.count(),
                "resourceCategories", resourceCategoryRepository.count(),
                "resourceTopics", resourceTopicRepository.count()
        );
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=300")
                .body(body);
    }
}
