package takeyouup.example.takeyouup.dto.resources;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CategoryResponse {
    private UUID id;
    private String slug;
    private String title;
    private String shortTitle;
    private String description;
    private String heroText;
    private String accent;
    /**
     * Topic SUMMARIES — titles, concepts and question counts.
     *
     * Deliberately not TopicResponse: this endpoint is public, and TopicResponse
     * carries every question with its correctAnswerIndex and explanation. The
     * questions are served by the authenticated
     * /api/resources/categories/{c}/topics/{t} endpoint instead.
     */
    private List<TopicSummaryResponse> topics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}