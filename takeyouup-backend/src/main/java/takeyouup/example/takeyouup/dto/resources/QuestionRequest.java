package takeyouup.example.takeyouup.dto.resources;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {

    @NotBlank(message = "Question text is required")
    private String questionText;

    @Min(value = 0, message = "Correct answer index must be >= 0")
    private int correctAnswerIndex;

    private String explanation;

    private int sortOrder;

    @NotEmpty(message = "At least one option is required")
    @Size(min = 2, max = 6, message = "A question must have between 2 and 6 options")
    @Valid
    private List<OptionRequest> options;
}