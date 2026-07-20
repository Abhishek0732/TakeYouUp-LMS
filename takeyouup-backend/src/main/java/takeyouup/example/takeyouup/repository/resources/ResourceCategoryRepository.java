package takeyouup.example.takeyouup.repository.resources;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.resources.ResourceCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResourceCategoryRepository extends JpaRepository<ResourceCategory, UUID> {

    Optional<ResourceCategory> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    // simple — no joins at all
    @Query("SELECT c FROM ResourceCategory c WHERE c.slug = :slug")
    Optional<ResourceCategory> findBySlugWithFullDepth(@Param("slug") String slug);

    @Query("SELECT c FROM ResourceCategory c")
    List<ResourceCategory> findAllWithTopics();
}