package takeyouup.example.takeyouup.dto.team;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TeamMemberResponse {
    private UUID id;
    private String name;
    private String role;
    private String bio;
    private String photoUrl;
    private int sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
