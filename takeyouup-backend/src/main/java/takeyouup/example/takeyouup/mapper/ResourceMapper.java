package takeyouup.example.takeyouup.mapper;

import org.springframework.stereotype.Component;
import takeyouup.example.takeyouup.dto.resources.*;
import takeyouup.example.takeyouup.model.resources.McqQuestion;
import takeyouup.example.takeyouup.model.resources.ResourceCategory;
import takeyouup.example.takeyouup.model.resources.ResourceTopic;
import takeyouup.example.takeyouup.model.resources.QuestionOption;
import takeyouup.example.takeyouup.model.resources.TopicConcept;

import java.util.Comparator;

@Component
public class ResourceMapper {

    public OptionResponse toOptionResponse(QuestionOption o) {
        return OptionResponse.builder()
                .id(o.getId()).optionText(o.getOptionText()).optionIndex(o.getOptionIndex())
                .build();
    }

    public QuestionResponse toQuestionResponse(McqQuestion q) {
        return QuestionResponse.builder()
                .id(q.getId()).questionText(q.getQuestionText())
                .correctAnswerIndex(q.getCorrectAnswerIndex()).explanation(q.getExplanation())
                .sortOrder(q.getSortOrder()).createdAt(q.getCreatedAt()).updatedAt(q.getUpdatedAt())
                .options(q.getOptions().stream().map(this::toOptionResponse).toList())
                .build();
    }

    public TopicSummaryResponse toTopicSummary(ResourceTopic t) {
        return TopicSummaryResponse.builder()
                .id(t.getId()).slug(t.getSlug()).title(t.getTitle()).summary(t.getSummary())
                .difficulty(t.getDifficulty()).duration(t.getDuration())
                .questionCount(t.getQuestions().size())   // ← changed
                .sortOrder(t.getSortOrder())
                .concepts(t.getConcepts().stream().map(TopicConcept::getName).toList())
                .build();
    }

    public TopicResponse toTopicResponse1(ResourceTopic t) {
        return TopicResponse.builder()
                .id(t.getId()).slug(t.getSlug()).title(t.getTitle()).summary(t.getSummary())
                .difficulty(t.getDifficulty()).duration(t.getDuration())
                .questionCount(t.getQuestions().size())   // ← changed
                .sortOrder(t.getSortOrder())
                .createdAt(t.getCreatedAt()).updatedAt(t.getUpdatedAt())
                .concepts(t.getConcepts().stream().map(TopicConcept::getName).toList())
                .questions(t.getQuestions().stream().map(this::toQuestionResponse).toList())
                .build();
    }

    public CategorySummaryResponse toCategorySummary(ResourceCategory c) {
        return CategorySummaryResponse.builder()
                .id(c.getId()).slug(c.getSlug()).title(c.getTitle()).shortTitle(c.getShortTitle())
                .description(c.getDescription()).heroText(c.getHeroText()).accent(c.getAccent())
                .topicCount(c.getTopics().size())
                .topics(c.getTopics().stream().map(this::toTopicSummary).toList())
                .build();
    }

    public CategoryResponse toCategoryResponse(ResourceCategory c) {
        return CategoryResponse.builder()
                .id(c.getId()).slug(c.getSlug()).title(c.getTitle()).shortTitle(c.getShortTitle())
                .description(c.getDescription()).heroText(c.getHeroText()).accent(c.getAccent())
                .createdAt(c.getCreatedAt()).updatedAt(c.getUpdatedAt())
                .topics(c.getTopics().stream()
                        .sorted(Comparator.comparingInt(ResourceTopic::getSortOrder))
                        .map(this::toTopicResponse)
                        .toList())
                .build();
    }

    public TopicResponse toTopicResponse(ResourceTopic t) {
        return TopicResponse.builder()
                .id(t.getId()).slug(t.getSlug()).title(t.getTitle()).summary(t.getSummary())
                .difficulty(t.getDifficulty()).duration(t.getDuration())
                .questionCount(t.getQuestions().size())
                .sortOrder(t.getSortOrder())
                .createdAt(t.getCreatedAt()).updatedAt(t.getUpdatedAt())
                .concepts(t.getConcepts().stream()
                        .sorted(Comparator.comparingInt(TopicConcept::getSortOrder))
                        .map(TopicConcept::getName)
                        .toList())
                .questions(t.getQuestions().stream()
                        .sorted(Comparator.comparingInt(McqQuestion::getSortOrder))
                        .map(this::toQuestionResponse)
                        .toList())
                .build();
    }
}
