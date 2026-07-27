package takeyouup.example.takeyouup.dto.team;

import lombok.Data;

/**
 * The editable fields of a team member. Arrives as the JSON {@code member} part
 * of a multipart request (the photo is the sibling {@code image} part), so it is
 * parsed by ObjectMapper rather than bound with {@code @RequestBody} — the same
 * shape the course editor uses. {@code sortOrder} is optional; when null the
 * service appends the member at the end.
 */
@Data
public class TeamMemberRequest {
    private String name;
    private String role;
    private String bio;
    private Integer sortOrder;
}
