package takeyouup.example.takeyouup.service.resources;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.dto.resources.OptionRequest;
import takeyouup.example.takeyouup.dto.resources.QuestionRequest;
import takeyouup.example.takeyouup.dto.resources.QuestionResponse;
import takeyouup.example.takeyouup.dto.resources.ReorderRequest;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.mapper.ResourceMapper;
import takeyouup.example.takeyouup.model.resources.McqQuestion;
import takeyouup.example.takeyouup.repository.resources.McqQuestionRepository;
import takeyouup.example.takeyouup.repository.resources.QuestionOptionRepository;
import takeyouup.example.takeyouup.repository.resources.ResourceTopicRepository;
import takeyouup.example.takeyouup.model.resources.QuestionOption;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ResourceQuestionService {

    private final McqQuestionRepository questionRepo;
    private final ResourceTopicRepository topicRepo;
    private final QuestionOptionRepository optionRepo;
    private final ResourceMapper mapper;

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByTopic1(UUID topicId) {
        if (!topicRepo.existsById(topicId)) {
            throw new ResourceNotFoundException("Topic not found: " + topicId);
        }
        return questionRepo.findByTopicIdWithOptions(topicId)
                .stream()
                .map(mapper::toQuestionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByTopic(UUID topicId) {
        if (!topicRepo.existsById(topicId)) {
            throw new ResourceNotFoundException("Topic not found: " + topicId);
        }
        var questions = questionRepo.findByTopicIdOrderBySortOrderAsc(topicId);
        for (McqQuestion q : questions) {
            var options = optionRepo.findByQuestionIdOrderByOptionIndexAsc(q.getId());
            q.getOptions().clear();
            q.getOptions().addAll(options);
        }
        return questions.stream().map(mapper::toQuestionResponse).toList();
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(UUID questionId) {
        return questionRepo.findByIdWithOptions(questionId)
                .map(mapper::toQuestionResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getRandomQuestions(UUID topicId, int count) {
        if (!topicRepo.existsById(topicId)) {
            throw new ResourceNotFoundException("Topic not found: " + topicId);
        }

        long total = questionRepo.countByTopicId(topicId);
        int safeCount = (int) Math.min(count, total); // never ask for more than available

        return questionRepo.findRandomByTopicId(topicId, safeCount)
                .stream()
                .map(mapper::toQuestionResponse)
                .toList();
    }

    public QuestionResponse createQuestion1(UUID topicId, QuestionRequest req) {
        var topic = topicRepo.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));

        validateCorrectAnswerIndex(req);

        int nextOrder = questionRepo.findMaxSortOrderByTopicId(topicId) + 1;

        var question = McqQuestion.builder()
                .questionText(req.getQuestionText())
                .correctAnswerIndex(req.getCorrectAnswerIndex())
                .explanation(req.getExplanation())
                .sortOrder(req.getSortOrder() > 0 ? req.getSortOrder() : nextOrder)
                .topic(topic)
                .build();

        var saved = questionRepo.save(question);
        saveOptions(saved, req.getOptions());

        return mapper.toQuestionResponse(
                questionRepo.findByIdWithOptions(saved.getId()).orElseThrow());
    }

    public QuestionResponse createQuestion(UUID topicId, QuestionRequest req) {
        var topic = topicRepo.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));

        validateCorrectAnswerIndex(req);

        int nextOrder = questionRepo.findMaxSortOrderByTopicId(topicId) + 1;

        var question = McqQuestion.builder()
                .questionText(req.getQuestionText())
                .correctAnswerIndex(req.getCorrectAnswerIndex())
                .explanation(req.getExplanation())
                .sortOrder(req.getSortOrder() > 0 ? req.getSortOrder() : nextOrder)
                .topic(topic)
                .build();

        var saved = questionRepo.save(question);
        saveOptions(saved, req.getOptions());

        // map directly — no re-fetch needed
        return mapper.toQuestionResponse(saved);
    }

    public QuestionResponse updateQuestion(UUID questionId, QuestionRequest req) {
        var question = questionRepo.findByIdWithOptions(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));

        validateCorrectAnswerIndex(req);

        question.setQuestionText(req.getQuestionText());
        question.setCorrectAnswerIndex(req.getCorrectAnswerIndex());
        question.setExplanation(req.getExplanation());
        question.setSortOrder(req.getSortOrder());

        // Replace options: delete all then reinsert
        optionRepo.deleteAllByQuestionId(questionId);
        saveOptions(question, req.getOptions());

        return mapper.toQuestionResponse(questionRepo.save(question));
    }

    public void deleteQuestion(UUID questionId) {
        if (!questionRepo.existsById(questionId)) {
            throw new ResourceNotFoundException("Question not found: " + questionId);
        }
        questionRepo.deleteById(questionId); // cascade removes options
    }

    public void reorderQuestions(UUID topicId, ReorderRequest req) {
        if (!topicRepo.existsById(topicId)) {
            throw new ResourceNotFoundException("Topic not found: " + topicId);
        }

        List<McqQuestion> questions = questionRepo.findByTopicIdOrderBySortOrderAsc(topicId);

        Map<UUID, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < req.getOrderedIds().size(); i++) {
            indexMap.put(req.getOrderedIds().get(i), i);
        }

        questions.forEach(q -> {
            if (indexMap.containsKey(q.getId())) {
                q.setSortOrder(indexMap.get(q.getId()));
            }
        });

        questionRepo.saveAll(questions);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private void saveOptions1(McqQuestion question, List<OptionRequest> optionRequests) {
        for (var opt : optionRequests) {
            optionRepo.save(QuestionOption.builder()
                    .optionText(opt.getOptionText())
                    .optionIndex(opt.getOptionIndex())
                    .question(question)
                    .build());
        }
    }

    private void saveOptions(McqQuestion question, List<OptionRequest> optionRequests) {
        for (var opt : optionRequests) {
            var option = QuestionOption.builder()
                    .optionText(opt.getOptionText())
                    .optionIndex(opt.getOptionIndex())
                    .question(question)
                    .build();
            optionRepo.save(option);
            question.getOptions().add(option); // keep in-memory list in sync
        }
    }

    /**
     * Ensures correctAnswerIndex actually points to one of the submitted options.
     * Catches mismatches like correctAnswerIndex=3 when only 3 options (0,1,2) exist.
     */
    private void validateCorrectAnswerIndex(QuestionRequest req) {
        long maxIndex = req.getOptions().stream()
                .mapToInt(OptionRequest::getOptionIndex)
                .max()
                .orElse(-1);

        if (req.getCorrectAnswerIndex() > maxIndex) {
            throw new IllegalArgumentException(
                    "correctAnswerIndex " + req.getCorrectAnswerIndex()
                            + " is out of range — max option index is " + maxIndex);
        }
    }
}