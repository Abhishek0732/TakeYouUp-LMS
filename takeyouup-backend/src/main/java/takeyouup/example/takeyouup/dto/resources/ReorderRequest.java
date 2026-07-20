package takeyouup.example.takeyouup.dto.resources;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ReorderRequest {

    @NotEmpty(message = "Ordered IDs list must not be empty")
    private List<UUID> orderedIds;
}