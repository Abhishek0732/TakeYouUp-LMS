package takeyouup.example.takeyouup.model.team;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * One person on the About-page team roster.
 *
 * Content, not a user account — so it follows the UUID-primary-key convention
 * used by the blog and resource entities. {@code photoUrl} is a host-relative
 * {@code /uploads/team/...} path produced by {@link
 * takeyouup.example.takeyouup.service.FileStorageService}, or null (the card
 * then shows an initials avatar). Ordering on the page is by {@code sortOrder}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "team_members")
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    /** The pill under the name, e.g. "Founder & CEO". */
    private String role;

    /** The muted subtitle line, e.g. "Software Engineer". */
    @Column(length = 512)
    private String bio;

    @Column(name = "photo_url", length = 512)
    private String photoUrl;

    private int sortOrder;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
