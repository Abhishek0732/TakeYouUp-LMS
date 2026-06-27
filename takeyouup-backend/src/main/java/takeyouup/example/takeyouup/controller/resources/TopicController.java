package takeyouup.example.takeyouup.controller.resources;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.resources.TopicRequest;
import takeyouup.example.takeyouup.dto.resources.TopicResponse;
import takeyouup.example.takeyouup.dto.resources.TopicSummaryResponse;
import takeyouup.example.takeyouup.service.resources.ResourceTopicService;

import java.util.List;
import java.util.UUID;

@RestController("resourceTopicController")
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin
public class TopicController {

    private final ResourceTopicService topicService;

    // All topics for a category (by category slug)
    @GetMapping("/categories/{categorySlug}/topics")
    public ResponseEntity<List<TopicSummaryResponse>> getByCategory(@PathVariable String categorySlug) {
        return ResponseEntity.ok(topicService.getTopicsByCategory(categorySlug));
    }

    // Single topic by slug (nested under category)
    @GetMapping("/categories/{categorySlug}/topics/{topicSlug}")
    public ResponseEntity<TopicResponse> getBySlug(
            @PathVariable String categorySlug, @PathVariable String topicSlug) {
        return ResponseEntity.ok(topicService.getTopicBySlug(categorySlug, topicSlug));
    }

    // Direct access by UUID (useful for admin)
    @GetMapping("/topics/{topicId}")
    public ResponseEntity<TopicResponse> getById(@PathVariable UUID topicId) {
        return ResponseEntity.ok(topicService.getTopicById(topicId));
    }

    @PostMapping("/categories/{categoryId}/topics")
    public ResponseEntity<TopicSummaryResponse> create(
            @PathVariable UUID categoryId, @Valid @RequestBody TopicRequest req) {
        return ResponseEntity.status(201).body(topicService.createTopic(categoryId, req));
    }

    @PutMapping("/topics/{topicId}")
    public ResponseEntity<TopicSummaryResponse> update(
            @PathVariable UUID topicId, @Valid @RequestBody TopicRequest req) {
        return ResponseEntity.ok(topicService.updateTopic(topicId, req));
    }

    @DeleteMapping("/topics/{topicId}")
    public ResponseEntity<Void> delete(@PathVariable UUID topicId) {
        topicService.deleteTopic(topicId);
        return ResponseEntity.noContent().build();
    }
}
