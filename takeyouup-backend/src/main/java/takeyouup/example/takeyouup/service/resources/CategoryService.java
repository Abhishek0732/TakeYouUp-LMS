package takeyouup.example.takeyouup.service.resources;


import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.dto.resources.CategoryRequest;
import takeyouup.example.takeyouup.dto.resources.CategoryResponse;
import takeyouup.example.takeyouup.dto.resources.CategorySummaryResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.mapper.ResourceMapper;
import takeyouup.example.takeyouup.model.resources.ResourceTopic;
import takeyouup.example.takeyouup.model.resources.TopicConcept;
import takeyouup.example.takeyouup.repository.resources.*;
import takeyouup.example.takeyouup.model.resources.ResourceCategory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final ResourceCategoryRepository categoryRepo;
    private final ResourceMapper mapper;
    private final ResourceTopicRepository topicRepo;
    private final McqQuestionRepository questionRepo;
    private final TopicConceptRepository conceptRepo;

    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getAllCategories1() {
        return categoryRepo.findAllWithTopics().stream()
                .map(mapper::toCategorySummary).toList();
    }

    /**
     * Public catalogue listing. Costs four queries regardless of how many
     * questions exist: categories, their topics, one grouped COUNT and one
     * batched concept read. Reading {@code topic.getQuestions()} here instead
     * would load every question body in the database just to count them.
     */
    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getAllCategories() {
        var categories = categoryRepo.findAll();
        if (categories.isEmpty()) {
            return List.of();
        }

        List<ResourceTopic> allTopics = new ArrayList<>();
        for (ResourceCategory category : categories) {
            var topics = topicRepo.findByCategoryIdOrderBySortOrderAsc(category.getId());
            category.getTopics().clear();
            category.getTopics().addAll(topics);
            allTopics.addAll(topics);
        }

        List<UUID> topicIds = allTopics.stream().map(ResourceTopic::getId).toList();
        if (topicIds.isEmpty()) {
            return categories.stream()
                    .map(c -> mapper.toCategorySummary(c, Map.of(), Map.of()))
                    .toList();
        }

        Map<UUID, Integer> questionCounts = new HashMap<>();
        for (Object[] row : questionRepo.countByTopicIds(topicIds)) {
            questionCounts.put((UUID) row[0], ((Number) row[1]).intValue());
        }

        Map<UUID, List<String>> conceptsByTopic = new HashMap<>();
        for (TopicConcept concept : conceptRepo.findByTopicIdInOrderByTopicIdAscSortOrderAsc(topicIds)) {
            conceptsByTopic
                    .computeIfAbsent(concept.getTopic().getId(), k -> new ArrayList<>())
                    .add(concept.getName());
        }

        return categories.stream()
                .map(c -> mapper.toCategorySummary(c, questionCounts, conceptsByTopic))
                .toList();
    }

    /**
     * Public category page: the topic list with counts, and no question bodies.
     *
     * This used to load every question (with options) of every topic just to
     * render a list of topic cards — both a needless read of the whole MCQ set
     * and, now that the endpoint is public, a leak of the correct answers.
     * The questions live behind the authenticated topic endpoint.
     */
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryBySlug(String slug) {
        var category = categoryRepo.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + slug));

        var topics = topicRepo.findByCategoryIdOrderBySortOrderAsc(category.getId());
        category.getTopics().clear();
        category.getTopics().addAll(topics);

        List<UUID> topicIds = topics.stream().map(ResourceTopic::getId).toList();
        Map<UUID, Integer> questionCounts = new HashMap<>();
        Map<UUID, List<String>> conceptsByTopic = new HashMap<>();

        if (!topicIds.isEmpty()) {
            for (Object[] row : questionRepo.countByTopicIds(topicIds)) {
                questionCounts.put((UUID) row[0], ((Number) row[1]).intValue());
            }
            for (TopicConcept concept : conceptRepo.findByTopicIdInOrderByTopicIdAscSortOrderAsc(topicIds)) {
                conceptsByTopic
                        .computeIfAbsent(concept.getTopic().getId(), k -> new ArrayList<>())
                        .add(concept.getName());
            }
        }

        return mapper.toCategoryResponse(category, questionCounts, conceptsByTopic);
    }

    public CategorySummaryResponse createCategory(CategoryRequest req) {
        if (categoryRepo.existsBySlug(req.getSlug()))
            throw new DataIntegrityViolationException("Slug already exists");
        var category = ResourceCategory.builder()
                .slug(req.getSlug()).title(req.getTitle()).shortTitle(req.getShortTitle())
                .description(req.getDescription()).heroText(req.getHeroText()).accent(req.getAccent())
                .build();
        return mapper.toCategorySummary(categoryRepo.save(category));
    }

    public CategorySummaryResponse updateCategory(UUID id, CategoryRequest req) {
        var category = categoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        if (categoryRepo.existsBySlugAndIdNot(req.getSlug(), id))
            throw new DataIntegrityViolationException("Slug already exists");
        category.setSlug(req.getSlug()); category.setTitle(req.getTitle());
        category.setShortTitle(req.getShortTitle()); category.setDescription(req.getDescription());
        category.setHeroText(req.getHeroText()); category.setAccent(req.getAccent());
        return mapper.toCategorySummary(categoryRepo.save(category));
    }

    public void deleteCategory(UUID id) {
        if (!categoryRepo.existsById(id))
            throw new ResourceNotFoundException("Category not found: " + id);
        categoryRepo.deleteById(id);  // cascade handles topics/questions/options
    }
}
