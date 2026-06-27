package takeyouup.example.takeyouup.dto.resources;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
public class QuestionResponse {
    private UUID id;
    private String questionText;
    private int correctAnswerIndex;
    private String explanation;
    private int sortOrder;
    private List<OptionResponse> options;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
