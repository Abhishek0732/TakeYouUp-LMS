package takeyouup.example.takeyouup.dto.quiz;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuizAttemptResponse {
    private Long id;
    private Long quizId;
    private String quizTitle;
    private int score;
    private int total;
    private int percent;
    private LocalDateTime createdAt;
}
