package takeyouup.example.takeyouup.dto.quiz;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class QuizAttemptRequest {
    @NotNull
    private Long quizId;

    /** Selected option index for each question, in order. */
    @NotNull
    private List<Integer> answers;
}
