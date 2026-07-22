package takeyouup.example.takeyouup.repository.content;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.content.SiteText;

import java.util.List;
import java.util.Optional;

public interface SiteTextRepository extends JpaRepository<SiteText, Long> {

    Optional<SiteText> findByContentKey(String contentKey);

    List<SiteText> findAllByOrderByContentKeyAsc();
}
