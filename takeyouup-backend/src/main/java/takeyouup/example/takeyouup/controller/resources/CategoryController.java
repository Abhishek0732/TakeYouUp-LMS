package takeyouup.example.takeyouup.controller.resources;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.resources.CategoryRequest;
import takeyouup.example.takeyouup.dto.resources.CategoryResponse;
import takeyouup.example.takeyouup.dto.resources.CategorySummaryResponse;
import takeyouup.example.takeyouup.dto.resources.ReorderRequest;
import takeyouup.example.takeyouup.service.resources.CategoryService;
import takeyouup.example.takeyouup.service.resources.ResourceTopicService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resources/categories")
@RequiredArgsConstructor
@CrossOrigin
public class CategoryController {

    private final CategoryService categoryService;
    private final ResourceTopicService topicService;  // inject TopicService for reordering topics

    @GetMapping
    public ResponseEntity<List<CategorySummaryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<CategorySummaryResponse> create(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.status(201).body(categoryService.createCategory(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategorySummaryResponse> update(
            @PathVariable UUID id, @Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(categoryService.updateCategory(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Reorder topics within a category
    @PatchMapping("/{id}/topics/reorder")
    public ResponseEntity<Void> reorderTopics(
            @PathVariable UUID id, @Valid @RequestBody ReorderRequest req) {
        topicService.reorderTopics(id, req);   // inject TopicService here too
        return ResponseEntity.noContent().build();
    }
}