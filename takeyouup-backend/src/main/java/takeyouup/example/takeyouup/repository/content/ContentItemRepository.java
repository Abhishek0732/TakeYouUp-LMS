package takeyouup.example.takeyouup.repository.content;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.content.ContentItem;

import java.util.List;

public interface ContentItemRepository extends JpaRepository<ContentItem, Long> {

    /** Everything the public site renders, in the order it renders it. */
    List<ContentItem> findByActiveTrueOrderBySectionAscSortOrderAsc();

    /** Admin view: inactive rows included, so they can be switched back on. */
    List<ContentItem> findAllByOrderBySectionAscSortOrderAsc();

    List<ContentItem> findBySectionOrderBySortOrderAsc(String section);
}
