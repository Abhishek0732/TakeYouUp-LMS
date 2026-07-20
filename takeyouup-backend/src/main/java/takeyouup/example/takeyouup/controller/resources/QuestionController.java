package takeyouup.example.takeyouup.controller.resources;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.resources.QuestionRequest;
import takeyouup.example.takeyouup.dto.resources.QuestionResponse;
import takeyouup.example.takeyouup.dto.resources.ReorderRequest;
import takeyouup.example.takeyouup.service.resources.ResourceQuestionService;

import java.util.List;

@RestController("resourceQuestionController")
@RequestMapping("/api/resources/topics/{topicId}/questions")
@RequiredArgsConstructor
@CrossOrigin
public class QuestionController {

    private final ResourceQuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAll(@PathVariable UUID topicId) {
        return ResponseEntity.ok(questionService.getQuestionsByTopic(topicId));
    }

    // Random questions for quiz/practice mode
    @GetMapping("/random")
    public ResponseEntity<List<QuestionResponse>> getRandom(
            @PathVariable UUID topicId,
            @RequestParam(defaultValue = "5") int count) {
        return ResponseEntity.ok(questionService.getRandomQuestions(topicId, count));
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionResponse> getById(
            @PathVariable UUID topicId, @PathVariable UUID questionId) {
        return ResponseEntity.ok(questionService.getQuestionById(questionId));
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> create(
            @PathVariable UUID topicId, @Valid @RequestBody QuestionRequest req) {
        return ResponseEntity.status(201).body(questionService.createQuestion(topicId, req));
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<QuestionResponse> update(
            @PathVariable UUID topicId,
            @PathVariable UUID questionId,
            @Valid @RequestBody QuestionRequest req) {
        return ResponseEntity.ok(questionService.updateQuestion(questionId, req));
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID topicId, @PathVariable UUID questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorder(
            @PathVariable UUID topicId, @Valid @RequestBody ReorderRequest req) {
        questionService.reorderQuestions(topicId, req);
        return ResponseEntity.noContent().build();
    }
}
