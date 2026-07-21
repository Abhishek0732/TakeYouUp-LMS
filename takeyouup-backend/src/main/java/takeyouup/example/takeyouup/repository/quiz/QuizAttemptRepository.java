package takeyouup.example.takeyouup.repository.quiz;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.quiz.QuizAttempt;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByCreatedAtDesc(User user);
    List<QuizAttempt> findByUserAndQuizIdOrderByCreatedAtDesc(User user, Long quizId);

    @Transactional
    void deleteByQuizId(Long quizId);

    /**
     * [attempt count, mean score percent] for a user in one row, instead of
     * loading every attempt to average them in Java.
     */
    @Query("""
        SELECT COUNT(a), COALESCE(AVG(CASE WHEN a.total = 0 THEN 0
                                           ELSE (a.score * 100.0) / a.total END), 0)
        FROM QuizAttempt a WHERE a.user = :user
    """)
    // List<Object[]>, not Object[]: a single multi-column row still comes back
    // wrapped in a list, and declaring Object[] yields Object[]{Object[]{...}}.
    List<Object[]> summariseForUser(@Param("user") User user);
}
