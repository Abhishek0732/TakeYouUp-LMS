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
import takeyouup.example.takeyouup.repository.resources.*;
import takeyouup.example.takeyouup.model.resources.ResourceCategory;

import java.util.List;
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

    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getAllCategories() {
        var categories = categoryRepo.findAll();
        for (ResourceCategory category : categories) {
            var topics = topicRepo.findByCategoryIdOrderBySortOrderAsc(category.getId());
            category.getTopics().clear();
            category.getTopics().addAll(topics);
        }
        return categories.stream().map(mapper::toCategorySummary).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryBySlug(String slug) {
        var category = categoryRepo.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + slug));

        // load topics separately
        var topics = topicRepo.findByCategoryIdOrderBySortOrderAsc(category.getId());

        // for each topic load questions + options separately
        for (ResourceTopic topic : topics) {
            var questions = questionRepo.findByTopicIdWithOptions(topic.getId());
            topic.getQuestions().clear();
            topic.getQuestions().addAll(questions);

            var concepts = conceptRepo.findByTopicIdOrderBySortOrderAsc(topic.getId());
            topic.getConcepts().clear();
            topic.getConcepts().addAll(concepts);
        }

        category.getTopics().clear();
        category.getTopics().addAll(topics);

        return mapper.toCategoryResponse(category);
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
