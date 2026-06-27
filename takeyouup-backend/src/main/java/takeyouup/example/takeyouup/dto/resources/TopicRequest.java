package takeyouup.example.takeyouup.dto.resources;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TopicRequest {

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase kebab-case")
    private String slug;

    @NotBlank(message = "Title is required")
    private String title;

    private String summary;
    private String difficulty;
    private String duration;
    private int sortOrder;
    private List<String> concepts = new ArrayList<>();
}
