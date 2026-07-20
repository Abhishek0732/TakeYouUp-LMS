package takeyouup.example.takeyouup.controller.quiz;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.quiz.QuizAttemptRequest;
import takeyouup.example.takeyouup.dto.quiz.QuizAttemptResponse;
import takeyouup.example.takeyouup.dto.quiz.QuizRequest;
import takeyouup.example.takeyouup.dto.quiz.QuizResponse;
import takeyouup.example.takeyouup.service.quiz.QuizAttemptService;
import takeyouup.example.takeyouup.service.quiz.QuizService;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin
public class QuizController {

    private final QuizService quizService;
    private final QuizAttemptService quizAttemptService;

    public QuizController(QuizService quizService, QuizAttemptService quizAttemptService) {
        this.quizService = quizService;
        this.quizAttemptService = quizAttemptService;
    }

    // ---- Quiz attempts (any authenticated user) ----
    @PostMapping("/attempts")
    public QuizAttemptResponse submitAttempt(@Valid @RequestBody QuizAttemptRequest request) {
        return quizAttemptService.submit(request);
    }

    @GetMapping("/attempts/mine")
    public List<QuizAttemptResponse> myAttempts() {
        return quizAttemptService.myAttempts();
    }

    @PostMapping
    public QuizResponse createQuiz(@RequestBody QuizRequest request) throws Exception {
        return quizService.createQuiz(request);
    }

    @GetMapping("/course/{courseId}")
    public List<QuizResponse> getQuizByCourse(@PathVariable Long courseId) throws Exception {
        return quizService.getQuizByCourse(courseId);
    }

    @GetMapping("/{id}")
    public QuizResponse getQuiz(@PathVariable Long id) throws Exception {
        return quizService.getQuizById(id);
    }

    @PutMapping("/{id}")
    public QuizResponse updateQuiz(
            @PathVariable Long id,
            @RequestBody QuizRequest request
    ) throws Exception {
        return quizService.updateQuiz(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return "Quiz deleted successfully";
    }
}
