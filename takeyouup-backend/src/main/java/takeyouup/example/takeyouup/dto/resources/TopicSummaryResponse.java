package takeyouup.example.takeyouup.dto.resources;

import lombok.Builder;
import lombok.Data;


import java.util.UUID;
import java.util.List;

@Data
@Builder
public class TopicSummaryResponse {
    private UUID id;
    private String slug;
    private String title;
    private String summary;
    private String difficulty;
    private String duration;
    private int questionCount;
    private int sortOrder;
    private List<String> concepts;
}
