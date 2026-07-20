package takeyouup.example.takeyouup.service.quiz;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.quiz.QuestionDTO;
import takeyouup.example.takeyouup.dto.quiz.QuizAttemptRequest;
import takeyouup.example.takeyouup.dto.quiz.QuizAttemptResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.quiz.Quiz;
import takeyouup.example.takeyouup.model.quiz.QuizAttempt;
import takeyouup.example.takeyouup.repository.quiz.QuizAttemptRepository;
import takeyouup.example.takeyouup.repository.quiz.QuizRepository;
import takeyouup.example.takeyouup.service.UserService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    /** Grades the submitted answers against the stored quiz and persists the attempt. */
    public QuizAttemptResponse submit(QuizAttemptRequest request) {
        User user = userService.getCurrentUser();

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        List<QuestionDTO> questions = parseQuestions(quiz);
        List<Integer> answers = request.getAnswers() == null ? List.of() : request.getAnswers();

        int total = questions.size();
        int score = 0;
        for (int i = 0; i < total; i++) {
            if (i < answers.size() && answers.get(i) != null
                    && answers.get(i) == questions.get(i).getCorrect()) {
                score++;
            }
        }

        QuizAttempt attempt = attemptRepository.save(QuizAttempt.builder()
                .user(user)
                .quizId(quiz.getId())
                .score(score)
                .total(total)
                .createdAt(LocalDateTime.now())
                .build());

        return toResponse(attempt, quiz.getTitle());
    }

    public List<QuizAttemptResponse> myAttempts() {
        User user = userService.getCurrentUser();
        return attemptRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(a -> toResponse(a, null))
                .toList();
    }

    private List<QuestionDTO> parseQuestions(Quiz quiz) {
        try {
            return objectMapper.readValue(quiz.getQuestionsJson(),
                    new TypeReference<List<QuestionDTO>>() {});
        } catch (Exception e) {
            throw new IllegalStateException("Quiz questions could not be read", e);
        }
    }

    private QuizAttemptResponse toResponse(QuizAttempt a, String title) {
        int percent = a.getTotal() == 0 ? 0 : (int) Math.round((a.getScore() * 100.0) / a.getTotal());
        return QuizAttemptResponse.builder()
                .id(a.getId())
                .quizId(a.getQuizId())
                .quizTitle(title)
                .score(a.getScore())
                .total(a.getTotal())
                .percent(percent)
                .createdAt(a.getCreatedAt())
                .build();
    }
}
