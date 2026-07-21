package takeyouup.example.takeyouup.controller.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.dsa.QuestionDTO;
import takeyouup.example.takeyouup.dto.dsa.QuestionProgressResponse;
import takeyouup.example.takeyouup.dto.dsa.QuestionRequest;
import takeyouup.example.takeyouup.dto.dsa.QuestionResponse;
import takeyouup.example.takeyouup.model.dsa.Question;
import takeyouup.example.takeyouup.service.dsa.QuestionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public Page<QuestionResponse> getQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search
    ) {
        return questionService.getQuestions(page, size, topic, difficulty, search);
    }

    /** Difficulty breakdown for the whole filtered set, not just the page. */
    @GetMapping("/stats")
    public Map<String, Long> getStats(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String search
    ) {
        return questionService.countByDifficulty(topic, search);
    }

    /** Solved-vs-total for the signed-in user, overall and per difficulty. */
    @GetMapping("/progress")
    public QuestionProgressResponse getProgress() {
        return questionService.getProgressForCurrentUser();
    }

    // Filter by topic
    @GetMapping("/topic/{topic}")
    public Page<QuestionResponse> getByTopic(
            @PathVariable String topic,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return questionService.getByTopic(topic, page, size);
    }

    // Filter by difficulty
    @GetMapping("/difficulty/{difficulty}")
    public Page<QuestionResponse> getByDifficulty(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return questionService.getByDifficulty(difficulty, page, size);
    }

    // Filter by platform
    @GetMapping("/platform/{platform}")
    public Page<QuestionResponse> getByPlatform(
            @PathVariable String platform,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return questionService.getByPlatform(platform, page, size);
    }

    // Search question
    @GetMapping("/search")
    public Page<QuestionResponse> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return questionService.search(keyword, page, size);
    }

    @PostMapping
    public Question addQuestion(@RequestBody QuestionRequest request) {

        return questionService.addQuestion(request);
    }

    @PostMapping("/bulk")
    public List<Question> addBulkQuestions(
            @RequestBody List<QuestionRequest> requests) {

        return questionService.addBulkQuestions(requests);
    }

    @PutMapping("/{id}")
    public Question updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionRequest request
    ) {

        return questionService.updateQuestion(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}
