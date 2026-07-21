package takeyouup.example.takeyouup.repository.resources;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.resources.McqQuestion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface McqQuestionRepository extends JpaRepository<McqQuestion, UUID> {

    List<McqQuestion> findByTopicIdOrderBySortOrderAsc(UUID topicId);

    @Query("SELECT DISTINCT q FROM McqQuestion q " +
            "LEFT JOIN FETCH q.options " +
            "WHERE q.topic.id = :topicId " +
            "ORDER BY q.sortOrder ASC")
    List<McqQuestion> findByTopicIdWithOptions(@Param("topicId") UUID topicId);

    @Query("SELECT DISTINCT q FROM McqQuestion q " +
            "LEFT JOIN FETCH q.options " +
            "WHERE q.id = :id")
    Optional<McqQuestion> findByIdWithOptions(@Param("id") UUID id);

    @Query("SELECT COALESCE(MAX(q.sortOrder), -1) FROM McqQuestion q WHERE q.topic.id = :topicId")
    int findMaxSortOrderByTopicId(@Param("topicId") UUID topicId);

    // Random questions for quiz mode. RAND() — RANDOM() is Postgres syntax and
    // throws on MySQL.
    @Query(value = "SELECT * FROM mcq_questions WHERE topic_id = :topicId ORDER BY RAND() LIMIT :limit",
            nativeQuery = true)
    List<McqQuestion> findRandomByTopicId(@Param("topicId") UUID topicId, @Param("limit") int limit);

    long countByTopicId(UUID topicId);

    /**
     * Question counts for many topics in one grouped query.
     *
     * The category listing only needs the NUMBER of questions — touching
     * topic.getQuestions().size() would drag every question body (TEXT columns)
     * of every topic into memory just to call size().
     */
    @Query("SELECT q.topic.id, COUNT(q) FROM McqQuestion q WHERE q.topic.id IN :topicIds GROUP BY q.topic.id")
    List<Object[]> countByTopicIds(@Param("topicIds") List<UUID> topicIds);
}