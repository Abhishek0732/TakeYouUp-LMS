package takeyouup.example.takeyouup.repository.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.quiz.Quiz;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByCourseId(Long courseId);

}
