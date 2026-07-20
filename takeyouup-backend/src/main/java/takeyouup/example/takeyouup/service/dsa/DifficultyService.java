package takeyouup.example.takeyouup.service.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.model.dsa.Difficulty;
import takeyouup.example.takeyouup.repository.dsa.DifficultyRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DifficultyService {

    private final DifficultyRepository difficultyRepository;

    public Difficulty createDifficulty(String level) {

        Difficulty existing = difficultyRepository.findByLevel(level);

        if (existing != null) {
            throw new RuntimeException("Difficulty already exists");
        }

        Difficulty difficulty = new Difficulty();
        difficulty.setLevel(level);

        return difficultyRepository.save(difficulty);
    }

    public List<Difficulty> getAllDifficulties() {

        return difficultyRepository.findAll();
    }

    public Difficulty updateDifficulty(Long id, String level) {
        Difficulty difficulty = difficultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Difficulty not found"));
        difficulty.setLevel(level);
        return difficultyRepository.save(difficulty);
    }

    public void deleteDifficulty(Long id) {
        if (!difficultyRepository.existsById(id)) {
            throw new RuntimeException("Difficulty not found");
        }
        difficultyRepository.deleteById(id);
    }
}