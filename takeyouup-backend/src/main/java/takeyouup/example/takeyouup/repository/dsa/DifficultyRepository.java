package takeyouup.example.takeyouup.repository.dsa;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.dsa.Difficulty;

public interface DifficultyRepository extends JpaRepository<Difficulty, Long> {

    Difficulty findByLevel(String level);

}