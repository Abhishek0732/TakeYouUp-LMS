package takeyouup.example.takeyouup.controller.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.model.dsa.Difficulty;
import takeyouup.example.takeyouup.service.dsa.DifficultyService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/difficulties")
@RequiredArgsConstructor
public class DifficultyController {

    private final DifficultyService difficultyService;

    @PostMapping
    public Difficulty createDifficulty(@RequestBody Map<String, String> body) {

        return difficultyService.createDifficulty(body.get("level"));
    }

    @GetMapping
    public List<Difficulty> getAll() {

        return difficultyService.getAllDifficulties();
    }
}
