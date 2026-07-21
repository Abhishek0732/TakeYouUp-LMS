package takeyouup.example.takeyouup.service.resources;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.dto.resources.ReorderRequest;
import takeyouup.example.takeyouup.dto.resources.TopicRequest;
import takeyouup.example.takeyouup.dto.resources.TopicResponse;
import takeyouup.example.takeyouup.dto.resources.TopicSummaryResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.mapper.ResourceMapper;
import takeyouup.example.takeyouup.model.resources.McqQuestion;
import takeyouup.example.takeyouup.model.resources.ResourceTopic;
import takeyouup.example.takeyouup.repository.resources.*;
import takeyouup.example.takeyouup.model.resources.TopicConcept;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ResourceTopicService {

    private final ResourceTopicRepository topicRepo;
    private final ResourceCategoryRepository categoryRepo;
    private final TopicConceptRepository conceptRepo;
    private final McqQuestionRepository questionRepo;
    private final QuestionOptionRepository optionRepo;
    private final ResourceMapper mapper;

    @Transactional(readOnly = true)
    public List<TopicSummaryResponse> getTopicsByCategory(String categorySlug) {
        return topicRepo.findByCategorySlug(categorySlug)
                .stream()
                .map(mapper::toTopicSummary)
                .toList();
    }

//    @Transactional(readOnly = true)
//    public TopicResponse getTopicBySlug(String categorySlug, String topicSlug) {
//        var category = categoryRepo.findBySlug(categorySlug)
//                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categorySlug));
//
//        return topicRepo.findBySlugAndCategoryIdWithFullDepth(topicSlug, category.getId())
//                .map(mapper::toTopicResponse)
//                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicSlug));
//    }

    @Transactional(readOnly = true)
    public TopicResponse getTopicBySlug(String categorySlug, String topicSlug) {
        var category = categoryRepo.findBySlug(categorySlug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categorySlug));

        var topic = topicRepo.findBySlugAndCategoryId(topicSlug, category.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicSlug));

        // load concepts separately
        var concepts = conceptRepo.findByTopicIdOrderBySortOrderAsc(topic.getId());
        topic.getConcepts().clear();
        topic.getConcepts().addAll(concepts);

        // load questions separately
        // JOIN FETCH: one query for questions + options. Fetching options per
        // question was 1 + N round trips, and batch fetching can't help because
        // these were explicit repository calls rather than lazy proxies.
        var questions = questionRepo.findByTopicIdWithOptions(topic.getId());
        topic.getQuestions().clear();
        topic.getQuestions().addAll(questions);

        return mapper.toTopicResponse(topic);
    }

//    @Transactional(readOnly = true)
//    public TopicResponse getTopicById(UUID topicId) {
//        return topicRepo.findByIdWithFullDepth(topicId)
//                .map(mapper::toTopicResponse)
//                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));
//    }

    @Transactional(readOnly = true)
    public TopicResponse getTopicById(UUID topicId) {
        var topic = topicRepo.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));

        var concepts = conceptRepo.findByTopicIdOrderBySortOrderAsc(topic.getId());
        topic.getConcepts().clear();
        topic.getConcepts().addAll(concepts);

        // JOIN FETCH: one query for questions + options. Fetching options per
        // question was 1 + N round trips, and batch fetching can't help because
        // these were explicit repository calls rather than lazy proxies.
        var questions = questionRepo.findByTopicIdWithOptions(topic.getId());
        topic.getQuestions().clear();
        topic.getQuestions().addAll(questions);

        return mapper.toTopicResponse(topic);
    }

    public TopicSummaryResponse createTopic(UUID categoryId, TopicRequest req) {
        var category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));

        if (topicRepo.existsBySlugAndCategoryId(req.getSlug(), categoryId)) {
            throw new DataIntegrityViolationException(
                    "Slug '" + req.getSlug() + "' already exists in this category");
        }

        int nextOrder = topicRepo.findMaxSortOrderByCategoryId(categoryId) + 1;

        var topic = ResourceTopic.builder()
                .slug(req.getSlug())
                .title(req.getTitle())
                .summary(req.getSummary())
                .difficulty(req.getDifficulty())
                .duration(req.getDuration())
                .sortOrder(req.getSortOrder() > 0 ? req.getSortOrder() : nextOrder)
                .category(category)
                .build();

        var saved = topicRepo.save(topic);
        saveConceptsForTopic(saved, req.getConcepts());

        // map directly — no re-fetch needed
        return mapper.toTopicSummary(saved);
    }

    public TopicSummaryResponse updateTopic(UUID topicId, TopicRequest req) {
        var topic = topicRepo.findByIdWithFullDepth(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));

        if (topicRepo.existsBySlugAndCategoryIdAndIdNot(
                req.getSlug(), topic.getCategory().getId(), topicId)) {
            throw new DataIntegrityViolationException(
                    "Slug '" + req.getSlug() + "' already exists in this category");
        }

        topic.setSlug(req.getSlug());
        topic.setTitle(req.getTitle());
        topic.setSummary(req.getSummary());
        topic.setDifficulty(req.getDifficulty());
        topic.setDuration(req.getDuration());
        topic.setSortOrder(req.getSortOrder());

        // Replace concepts: delete all then reinsert in order
        conceptRepo.deleteAllByTopicId(topicId);
        saveConceptsForTopic(topic, req.getConcepts());

        return mapper.toTopicSummary(topicRepo.save(topic));
    }

    public void deleteTopic(UUID topicId) {
        if (!topicRepo.existsById(topicId)) {
            throw new ResourceNotFoundException("Topic not found: " + topicId);
        }
        topicRepo.deleteById(topicId); // cascade removes concepts + questions + options
    }

    public void reorderTopics(UUID categoryId, ReorderRequest req) {
        if (!categoryRepo.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found: " + categoryId);
        }

        List<ResourceTopic> topics = topicRepo.findByCategoryIdOrderBySortOrderAsc(categoryId);

        Map<UUID, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < req.getOrderedIds().size(); i++) {
            indexMap.put(req.getOrderedIds().get(i), i);
        }

        topics.forEach(t -> {
            if (indexMap.containsKey(t.getId())) {
                t.setSortOrder(indexMap.get(t.getId()));
            }
        });

        topicRepo.saveAll(topics);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private void saveConceptsForTopic1(ResourceTopic topic, List<String> conceptNames) {
        if (conceptNames == null || conceptNames.isEmpty()) return;
        for (int i = 0; i < conceptNames.size(); i++) {
            conceptRepo.save(TopicConcept.builder()
                    .name(conceptNames.get(i))
                    .sortOrder(i)
                    .topic(topic)
                    .build());
        }
    }

    private void saveConceptsForTopic(ResourceTopic topic, List<String> conceptNames) {
        if (conceptNames == null || conceptNames.isEmpty()) return;
        for (int i = 0; i < conceptNames.size(); i++) {
            var concept = TopicConcept.builder()
                    .name(conceptNames.get(i))
                    .sortOrder(i)
                    .topic(topic)
                    .build();
            conceptRepo.save(concept);
            topic.getConcepts().add(concept); // keep in-memory list in sync
        }
    }
}
