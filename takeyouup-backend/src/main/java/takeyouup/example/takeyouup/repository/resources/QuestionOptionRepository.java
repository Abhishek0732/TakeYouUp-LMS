package takeyouup.example.takeyouup.repository.resources;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.resources.QuestionOption;

import java.util.List;
import java.util.UUID;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, UUID> {

    List<QuestionOption> findByQuestionIdOrderByOptionIndexAsc(UUID questionId);

//    List<QuestionOption> findByTopicIdWithOptions(UUID topicId);

    @Modifying
    @Query("DELETE FROM QuestionOption o WHERE o.question.id = :questionId")
    void deleteAllByQuestionId(@Param("questionId") UUID questionId);
}
