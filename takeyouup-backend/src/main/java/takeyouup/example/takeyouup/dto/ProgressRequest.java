package takeyouup.example.takeyouup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProgressRequest {
    @NotBlank
    private String itemType;
    
    @NotBlank
    private String itemId;
}
