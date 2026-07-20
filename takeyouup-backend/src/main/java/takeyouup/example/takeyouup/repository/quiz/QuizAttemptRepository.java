package takeyouup.example.takeyouup.repository.quiz;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.quiz.QuizAttempt;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByCreatedAtDesc(User user);
    List<QuizAttempt> findByUserAndQuizIdOrderByCreatedAtDesc(User user, Long quizId);

    @Transactional
    void deleteByQuizId(Long quizId);
}
