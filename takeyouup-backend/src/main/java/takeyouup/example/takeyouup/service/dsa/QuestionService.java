package takeyouup.example.takeyouup.service.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.dsa.QuestionDTO;
import takeyouup.example.takeyouup.dto.dsa.QuestionRequest;
import takeyouup.example.takeyouup.dto.dsa.QuestionResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.dsa.Difficulty;
import takeyouup.example.takeyouup.model.dsa.Platform;
import takeyouup.example.takeyouup.model.dsa.Question;
import takeyouup.example.takeyouup.model.dsa.Topic;
import takeyouup.example.takeyouup.repository.dsa.DifficultyRepository;
import takeyouup.example.takeyouup.repository.dsa.PlatformRepository;
import takeyouup.example.takeyouup.repository.dsa.QuestionRepository;
import takeyouup.example.takeyouup.repository.dsa.TopicRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final PlatformRepository platformRepository;
    private final DifficultyRepository difficultyRepository;

    public Page<QuestionResponse> getQuestions(
            int page,
            int size,
            String topic,
            String difficulty,
            String search
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        boolean noFilters = (topic == null || topic.isBlank())
                && (difficulty == null || difficulty.isBlank())
                && (search == null || search.isBlank());

        // Fast path for the unfiltered listing: findAll() uses a plain COUNT(*)
        // instead of counting over the LEFT JOINs + LOWER()/OR-null conditions,
        // which is dramatically cheaper on large tables.
        Page<Question> questions = noFilters
                ? questionRepository.findAll(pageable)
                : questionRepository.findQuestions(topic, difficulty, search, pageable);

        return questions.map(this::mapToResponse);
    }

    private QuestionResponse mapToResponse(Question q) {

        QuestionResponse res = new QuestionResponse();

        res.setId(q.getId());
        res.setTitle(q.getTitle());
        res.setUrl(q.getUrl());
        // topic is required; platform/difficulty are optional and may be null
        res.setTopic(q.getTopic() != null ? q.getTopic().getName() : null);
        res.setDifficulty(q.getDifficulty() != null ? q.getDifficulty().getLevel() : null);
        res.setPlatform(q.getPlatform() != null ? q.getPlatform().getName() : null);

        return res;
    }

    public Page<QuestionResponse> getByTopic(String topic, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByTopic_Name(topic, pageable)
                .map(this::mapToResponse);
    }

    public Page<QuestionResponse> getByDifficulty(String difficulty, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByDifficulty_Level(difficulty, pageable)
                .map(this::mapToResponse);
    }

    public Page<QuestionResponse> getByPlatform(String platform, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByPlatform_Name(platform, pageable)
                .map(this::mapToResponse);
    }

    public Page<QuestionResponse> search(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return questionRepository
                .findByTitleContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);
    }

    public Question addQuestion(QuestionRequest request) {

        Question question = new Question();

        question.setTitle(request.getTitle());
        question.setUrl(request.getUrl());
        question.setTopic(resolveTopic(request.getTopic()));
        question.setPlatform(resolvePlatform(request.getPlatform()));
        question.setDifficulty(resolveDifficulty(request.getDifficulty()));

        return questionRepository.save(question);
    }

    // --- get-or-create helpers so admins can add questions with new
    //     topics/platforms/difficulties without a separate setup step ---

    /** Topic is required; created on the fly if it doesn't exist yet. */
    private Topic resolveTopic(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Topic is required");
        }
        Topic topic = topicRepository.findByName(name.trim());
        if (topic == null) {
            Topic created = new Topic();
            created.setName(name.trim());
            topic = topicRepository.save(created);
        }
        return topic;
    }

    /** Platform is optional; created if a new non-blank name is supplied. */
    private Platform resolvePlatform(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        Platform platform = platformRepository.findByName(name.trim());
        if (platform == null) {
            Platform created = new Platform();
            created.setName(name.trim());
            platform = platformRepository.save(created);
        }
        return platform;
    }

    /** Difficulty is optional; created if a new non-blank level is supplied. */
    private Difficulty resolveDifficulty(String level) {
        if (level == null || level.isBlank()) {
            return null;
        }
        Difficulty difficulty = difficultyRepository.findByLevel(level.trim());
        if (difficulty == null) {
            Difficulty created = new Difficulty();
            created.setLevel(level.trim());
            difficulty = difficultyRepository.save(created);
        }
        return difficulty;
    }

    public List<Question> addBulkQuestions(List<QuestionRequest> requests) {

        List<Question> questions = new ArrayList<>();

        for (QuestionRequest request : requests) {

            Question q = new Question();

            q.setTitle(request.getTitle());
            q.setUrl(request.getUrl());
            q.setTopic(resolveTopic(request.getTopic()));
            q.setPlatform(resolvePlatform(request.getPlatform()));
            q.setDifficulty(resolveDifficulty(request.getDifficulty()));

            questions.add(q);
        }

        return questionRepository.saveAll(questions);
    }

    public Question updateQuestion(Long id, QuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        question.setTitle(request.getTitle());
        question.setUrl(request.getUrl());
        question.setTopic(resolveTopic(request.getTopic()));
        question.setPlatform(resolvePlatform(request.getPlatform()));
        question.setDifficulty(resolveDifficulty(request.getDifficulty()));

        return questionRepository.save(question);
    }
}
