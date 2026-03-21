package takeyouup.example.takeyouup.controller.quiz;

import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.quiz.QuizRequest;
import takeyouup.example.takeyouup.dto.quiz.QuizResponse;
import takeyouup.example.takeyouup.service.quiz.QuizService;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
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
