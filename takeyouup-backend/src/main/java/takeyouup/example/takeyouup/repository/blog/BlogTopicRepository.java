package takeyouup.example.takeyouup.repository.blog;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.blog.BlogTopic;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlogTopicRepository extends JpaRepository<BlogTopic, UUID> {

    Optional<BlogTopic> findBySlug(String slug);

    boolean existsBySlug(String slug);

    /** The public menu: live topics only, in the order the editor chose. */
    List<BlogTopic> findByActiveTrueOrderBySortOrderAscNameAsc();

    /** The admin list: every topic, including the ones switched off. */
    List<BlogTopic> findAllByOrderBySortOrderAscNameAsc();
}
