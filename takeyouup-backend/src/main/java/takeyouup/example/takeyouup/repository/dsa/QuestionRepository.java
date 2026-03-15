package takeyouup.example.takeyouup.repository.dsa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.dsa.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
}
