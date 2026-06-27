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
    private List<TopicResponse> topics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}