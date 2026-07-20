package takeyouup.example.takeyouup.repository.resources;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.resources.TopicConcept;

import java.util.List;
import java.util.UUID;

public interface TopicConceptRepository extends JpaRepository<TopicConcept, UUID> {

    List<TopicConcept> findByTopicIdOrderBySortOrderAsc(UUID topicId);

//    List<TopicConcept> findByCategoryIdOrderBySortOrderAsc(UUID categoryId);

    @Modifying
    @Query("DELETE FROM TopicConcept c WHERE c.topic.id = :topicId")
    void deleteAllByTopicId(@Param("topicId") UUID topicId);
}