package takeyouup.example.takeyouup.service.quiz;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.quiz.QuestionDTO;
import takeyouup.example.takeyouup.dto.quiz.QuizRequest;
import takeyouup.example.takeyouup.dto.quiz.QuizResponse;
import takeyouup.example.takeyouup.model.quiz.Quiz;
import takeyouup.example.takeyouup.repository.quiz.QuizAttemptRepository;
import takeyouup.example.takeyouup.repository.quiz.QuizRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ObjectMapper objectMapper;

    public QuizService(QuizRepository quizRepository, QuizAttemptRepository quizAttemptRepository, ObjectMapper objectMapper) {
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.objectMapper = objectMapper;
    }

    public QuizResponse createQuiz(QuizRequest request) throws Exception {

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setCourseId(request.getCourseId());

        String json = objectMapper.writeValueAsString(request.getQuestions());
        quiz.setQuestionsJson(json);

        Quiz saved = quizRepository.save(quiz);

        return new QuizResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getCourseId(),
                request.getQuestions()
        );
    }

    public List<QuizResponse> getQuizByCourse(Long courseId) throws Exception {

        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);

        List<QuizResponse> response = new ArrayList<>();

        for (Quiz quiz : quizzes) {

            List<QuestionDTO> questions =
                    objectMapper.readValue(
                            quiz.getQuestionsJson(),
                            new TypeReference<List<QuestionDTO>>() {}
                    );

            response.add(
                    new QuizResponse(
                            quiz.getId(),
                            quiz.getTitle(),
                            quiz.getCourseId(),
                            questions
                    )
            );
        }

        return response;
    }

    public QuizResponse getQuizById(Long id) throws Exception {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<QuestionDTO> questions =
                objectMapper.readValue(
                        quiz.getQuestionsJson(),
                        new TypeReference<List<QuestionDTO>>() {}
                );

        return new QuizResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getCourseId(),
                questions
        );
    }

    public QuizResponse updateQuiz(Long id, QuizRequest request) throws Exception {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (request.getTitle() != null) {
            quiz.setTitle(request.getTitle());
        }

        if (request.getCourseId() != null) {
            quiz.setCourseId(request.getCourseId());
        } else {
            quiz.setCourseId(quiz.getCourseId());
        }

        List<QuestionDTO> existingQuestions = new ArrayList<>();

        if (quiz.getQuestionsJson() != null) {
            existingQuestions = objectMapper.readValue(
                    quiz.getQuestionsJson(),
                    new TypeReference<List<QuestionDTO>>() {}
            );
        }

        // 2. Add new questions
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            existingQuestions.addAll(request.getQuestions());
        }

        // 3. Convert back to JSON
        String json = objectMapper.writeValueAsString(existingQuestions);
        quiz.setQuestionsJson(json);

        Quiz updated = quizRepository.save(quiz);

        return new QuizResponse(
                updated.getId(),
                updated.getTitle(),
                updated.getCourseId(),
                request.getQuestions()
        );
    }

    public void deleteQuiz(Long id) {
        // Remove attempt history first so the FK constraint doesn't block deletion.
        quizAttemptRepository.deleteByQuizId(id);
        quizRepository.deleteById(id);
    }
}
