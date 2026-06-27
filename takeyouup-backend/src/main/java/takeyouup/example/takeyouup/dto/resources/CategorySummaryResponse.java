package takeyouup.example.takeyouup.dto.resources;

import lombok.Builder;
import lombok.Data;


import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CategorySummaryResponse {
    private UUID id;
    private String slug;
    private String title;
    private String shortTitle;
    private String description;
    private String heroText;
    private String accent;
    private int topicCount;
    private List<TopicSummaryResponse> topics;
}
