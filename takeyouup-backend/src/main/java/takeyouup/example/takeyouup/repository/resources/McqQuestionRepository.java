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

    // Random questions for quiz mode
    @Query(value = "SELECT * FROM mcq_questions WHERE topic_id = :topicId ORDER BY RANDOM() LIMIT :limit",
            nativeQuery = true)
    List<McqQuestion> findRandomByTopicId(@Param("topicId") UUID topicId, @Param("limit") int limit);

    long countByTopicId(UUID topicId);
}