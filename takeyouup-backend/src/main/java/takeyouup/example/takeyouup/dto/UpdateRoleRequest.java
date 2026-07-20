package takeyouup.example.takeyouup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    @NotBlank
    private String role; // USER or ADMIN
}
