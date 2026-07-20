package takeyouup.example.takeyouup.dto.resources;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase kebab-case")
    private String slug;

    @NotBlank(message = "Title is required")
    private String title;

    private String shortTitle;
    private String description;
    private String heroText;
    private String accent;
}