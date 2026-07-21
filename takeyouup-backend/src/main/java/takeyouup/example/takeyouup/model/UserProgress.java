package takeyouup.example.takeyouup.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "user_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "item_type", "item_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "item_type", nullable = false)
    private String itemType;

    @Column(name = "item_id", nullable = false)
    private String itemId;

    @Column(nullable = false)
    private boolean completed = false;

    /** When it was last marked complete — drives the daily streak. */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
