package takeyouup.example.takeyouup.repository.dsa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.dsa.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    Page<Question> findByTopic_Name(String topic, Pageable pageable);

    Page<Question> findByDifficulty_Level(String difficulty, Pageable pageable);

    Page<Question> findByPlatform_Name(String platform, Pageable pageable);

    Page<Question> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("""
        SELECT q FROM Question q
        WHERE (:topic IS NULL OR LOWER(q.topic.name) = LOWER(:topic))
        AND (:difficulty IS NULL OR LOWER(q.difficulty.level) = LOWER(:difficulty))
        AND (:search IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<Question> findQuestions(
            @Param("topic") String topic,
            @Param("difficulty") String difficulty,
            @Param("search") String search,
            Pageable pageable
    );

    /**
     * Counts per difficulty for the whole filtered set — the difficulty filter
     * itself is deliberately excluded so the summary cards keep showing every
     * bucket while one of them is selected.
     */
    @Query("""
        SELECT q.difficulty.level, COUNT(q) FROM Question q
        WHERE (:topic IS NULL OR LOWER(q.topic.name) = LOWER(:topic))
        AND (:search IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')))
        GROUP BY q.difficulty.level
    """)
    List<Object[]> countByDifficulty(
            @Param("topic") String topic,
            @Param("search") String search
    );

    /**
     * How many questions the given user has marked solved, grouped by difficulty.
     *
     * user_progress is generic (item_type + item_id VARCHAR), so the join casts
     * the id back to a number — comparing on questions.id keeps the primary key
     * index in play, and item_type filters out lesson rows.
     */
    @Query(value = """
        SELECT d.level, COUNT(*)
        FROM user_progress p
        JOIN questions q ON q.id = CAST(p.item_id AS UNSIGNED)
        JOIN difficulties d ON d.id = q.difficulty_id
        WHERE p.user_id = :userId
          AND p.item_type = 'QUESTION'
          AND p.completed = 1
        GROUP BY d.level
        """, nativeQuery = true)
    List<Object[]> countSolvedByDifficulty(@Param("userId") Long userId);
}
