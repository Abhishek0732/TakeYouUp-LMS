package takeyouup.example.takeyouup.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean emailVerified;
}
