package takeyouup.example.takeyouup.model.blog;

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
 * A category a blog post is filed under (e.g. "Data Structures", "Career").
 *
 * Admin-managed, mirroring how resource categories work: the public blog is
 * browsed by topic, so an editor curates the list rather than letting authors
 * invent a new tag on every post.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "blog_topics",
        uniqueConstraints = @UniqueConstraint(columnNames = "slug"))
public class BlogTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int sortOrder;

    /** A topic switched off keeps its posts but drops out of the public menu. */
    @Column(nullable = false)
    private boolean active;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
