package takeyouup.example.takeyouup.model.content;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single piece of editable copy addressed by a stable key — a headline, a
 * page intro, the footer tagline.
 *
 * Separate from {@link ContentItem} because these are not lists: there is
 * exactly one home-page subtitle, and modelling it as a one-row list would make
 * both the API and the admin screen worse. Keys are created by whoever writes
 * the component; the admin edits values, never keys, so a typo cannot orphan
 * text the page is asking for.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "site_text")
public class SiteText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** e.g. {@code home.hero.subtitle}. Unique; the frontend looks it up by name. */
    @Column(name = "content_key", nullable = false, unique = true, length = 128)
    private String contentKey;

    @Column(columnDefinition = "TEXT")
    private String value;

    /** Where this text appears, shown beside the field in the admin editor. */
    private String description;
}
