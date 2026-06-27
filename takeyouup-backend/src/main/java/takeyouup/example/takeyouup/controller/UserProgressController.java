package takeyouup.example.takeyouup.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.ProgressRequest;
import takeyouup.example.takeyouup.dto.ProgressResponse;
import takeyouup.example.takeyouup.service.UserProgressService;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@CrossOrigin
public class UserProgressController {

    private final UserProgressService progressService;

    @GetMapping
    public ResponseEntity<List<ProgressResponse>> getProgress() {
        return ResponseEntity.ok(progressService.getCurrentUserProgress());
    }

    @PostMapping("/toggle")
    public ResponseEntity<ProgressResponse> toggleProgress(@Valid @RequestBody ProgressRequest request) {
        return ResponseEntity.ok(progressService.toggleProgress(request));
    }
}
