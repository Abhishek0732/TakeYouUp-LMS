package takeyouup.example.takeyouup.model.content;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One row of an editable, repeatable list on the site — a FAQ entry, a feature
 * card, a value, a contact detail.
 *
 * These used to be arrays literal in the React components, so changing a single
 * FAQ answer meant editing source and redeploying. The columns are deliberately
 * generic: a fixed set of slots that the section's renderer interprets, rather
 * than a table per list. Six tables that differ only in which two strings they
 * hold is six admin screens nobody wants to maintain.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "content_item")
public class ContentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Which list this belongs to, e.g. {@code HOME_FAQ}. Free text rather than
     * an enum: the set of sections is decided by the frontend that renders
     * them, and a new one should not need a backend release.
     */
    @Column(nullable = false, length = 64)
    private String section;

    /** Heading, question, or — for a bullet list — the whole line. */
    private String title;

    /** Answer or description. Null where the section only needs a title. */
    @Column(columnDefinition = "TEXT")
    private String body;

    /** Lucide icon name, resolved against an allow-list in the frontend. */
    @Column(length = 64)
    private String icon;

    /** Optional href, e.g. mailto: on a contact detail. */
    @Column(length = 512)
    private String link;

    /** Spare slot for a section that needs one more field (a step number). */
    private String extra;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    /** Hide a row from the site without losing it. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
