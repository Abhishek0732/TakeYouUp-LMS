package takeyouup.example.takeyouup.dto.resources;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class OptionResponse {
    private UUID id;
    private String optionText;
    private int optionIndex;
}