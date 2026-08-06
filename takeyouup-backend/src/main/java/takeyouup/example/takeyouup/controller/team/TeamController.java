package takeyouup.example.takeyouup.controller.team;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import takeyouup.example.takeyouup.dto.team.TeamMemberRequest;
import takeyouup.example.takeyouup.dto.team.TeamMemberResponse;
import takeyouup.example.takeyouup.service.team.TeamService;

import java.util.List;
import java.util.UUID;

/**
 * The About-page team roster.
 *
 * GET is public (the roster is on a marketing page). Create/update/delete are
 * POST/PUT/DELETE under {@code /api/**}, so SecurityConfig's blanket rules make
 * them ADMIN-only automatically — no per-method annotation needed. The photo
 * rides along as the multipart {@code image} part, exactly like the course
 * cover editor; the JSON fields come in the {@code member} part.
 */
@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
@CrossOrigin
public class TeamController {

    private final TeamService teamService;
    private final ObjectMapper objectMapper;

    /** Public roster for the About page, in display order. */
    @GetMapping
    public ResponseEntity<List<TeamMemberResponse>> getAll() {
        return ResponseEntity.ok(teamService.getAll());
    }

    /**
     * Admin listing. Same data as the public read today, but kept on its own
     * path and gated to ADMIN in SecurityConfig so it can later carry rows the
     * public should not see without opening a hole in the public endpoint.
     */
    @GetMapping("/admin")
    public ResponseEntity<List<TeamMemberResponse>> getAllForAdmin() {
        return ResponseEntity.ok(teamService.getAll());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestPart("member") String memberJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            TeamMemberRequest req = objectMapper.readValue(memberJson, TeamMemberRequest.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(teamService.create(req, image));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not create the team member");
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable UUID id,
            @RequestPart("member") String memberJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            TeamMemberRequest req = objectMapper.readValue(memberJson, TeamMemberRequest.class);
            return ResponseEntity.ok(teamService.update(id, req, image));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not update the team member");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Remove the photo so the card falls back to an initials avatar. */
    @DeleteMapping("/{id}/photo")
    public ResponseEntity<TeamMemberResponse> clearPhoto(@PathVariable UUID id) {
        return ResponseEntity.ok(teamService.clearPhoto(id));
    }
}
