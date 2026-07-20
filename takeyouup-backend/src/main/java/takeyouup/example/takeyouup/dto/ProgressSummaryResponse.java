package takeyouup.example.takeyouup.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgressSummaryResponse {
    private Long courseId;
    private int totalLessons;
    private int completedLessons;
    private int percent;
    private boolean completed;
}
