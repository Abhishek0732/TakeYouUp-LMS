package takeyouup.example.takeyouup.dto.resources;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OptionRequest {

    @NotBlank(message = "Option text is required")
    private String optionText;

    @Min(value = 0, message = "Option index must be >= 0")
    private int optionIndex;
}