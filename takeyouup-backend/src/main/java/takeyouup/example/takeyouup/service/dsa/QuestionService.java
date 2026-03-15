package takeyouup.example.takeyouup.service.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.dsa.QuestionDTO;
import takeyouup.example.takeyouup.dto.dsa.QuestionRequest;
import takeyouup.example.takeyouup.dto.dsa.QuestionResponse;
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

        Page<Question> questions =
                questionRepository.findQuestions(topic, difficulty, search, pageable);

        return questions.map(this::mapToResponse);
    }

    private QuestionResponse mapToResponse(Question q) {

        QuestionResponse res = new QuestionResponse();

        res.setId(q.getId());
        res.setTitle(q.getTitle());
        res.setUrl(q.getUrl());
        res.setTopic(q.getTopic().getName());
        res.setDifficulty(q.getDifficulty().getLevel());
        res.setPlatform(q.getPlatform().getName());

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

        Topic topic = topicRepository.findByName(request.getTopic());
        Platform platform = platformRepository.findByName(request.getPlatform());
        Difficulty difficulty = difficultyRepository.findByLevel(request.getDifficulty());

        Question question = new Question();

        question.setTitle(request.getTitle());
        question.setUrl(request.getUrl());
        question.setTopic(topic);
        question.setPlatform(platform);
        question.setDifficulty(difficulty);

        return questionRepository.save(question);
    }

    public List<Question> addBulkQuestions(List<QuestionRequest> requests) {

        List<Question> questions = new ArrayList<>();

        for (QuestionRequest request : requests) {

            Topic topic = topicRepository.findByName(request.getTopic());
            Platform platform = platformRepository.findByName(request.getPlatform());
            Difficulty difficulty = difficultyRepository.findByLevel(request.getDifficulty());

            Question q = new Question();

            q.setTitle(request.getTitle());
            q.setUrl(request.getUrl());
            q.setTopic(topic);
            q.setPlatform(platform);
            q.setDifficulty(difficulty);

            questions.add(q);
        }

        return questionRepository.saveAll(questions);
    }

    public Question updateQuestion(Long id, QuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Topic topic = topicRepository.findByName(request.getTopic());
        Platform platform = platformRepository.findByName(request.getPlatform());
        Difficulty difficulty = difficultyRepository.findByLevel(request.getDifficulty());

        question.setTitle(request.getTitle());
        question.setUrl(request.getUrl());
        question.setTopic(topic);
        question.setPlatform(platform);
        question.setDifficulty(difficulty);

        return questionRepository.save(question);
    }
}
