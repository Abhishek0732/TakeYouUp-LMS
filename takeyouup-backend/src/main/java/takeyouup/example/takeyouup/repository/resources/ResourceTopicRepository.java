package takeyouup.example.takeyouup.repository.resources;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import takeyouup.example.takeyouup.model.resources.ResourceTopic;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResourceTopicRepository extends JpaRepository<ResourceTopic, UUID> {

    List<ResourceTopic> findByCategoryIdOrderBySortOrderAsc(UUID categoryId);

    Optional<ResourceTopic> findBySlugAndCategoryId(String slug, UUID categoryId);

    boolean existsBySlugAndCategoryId(String slug, UUID categoryId);

    boolean existsBySlugAndCategoryIdAndIdNot(String slug, UUID categoryId, UUID id);

    // ResourceTopicRepository
    @Query("SELECT DISTINCT t FROM ResourceTopic t " +
            "LEFT JOIN FETCH t.concepts c " +
            "LEFT JOIN FETCH t.questions q " +
            "LEFT JOIN FETCH q.options " +
            "WHERE t.id = :id " +
            "ORDER BY c.sortOrder ASC, q.sortOrder ASC")
    Optional<ResourceTopic> findByIdWithFullDepth(@Param("id") UUID id);

    @Query("SELECT DISTINCT t FROM ResourceTopic t " +
            "LEFT JOIN FETCH t.concepts " +
            "LEFT JOIN FETCH t.questions q " +
            "LEFT JOIN FETCH q.options " +
            "WHERE t.slug = :slug AND t.category.id = :categoryId")
    Optional<ResourceTopic> findBySlugAndCategoryIdWithFullDepth(
            @Param("slug") String slug,
            @Param("categoryId") UUID categoryId
    );

    @Query("SELECT t FROM ResourceTopic t " +
            "WHERE t.category.slug = :categorySlug " +
            "ORDER BY t.sortOrder ASC")
    List<ResourceTopic> findByCategorySlug(@Param("categorySlug") String categorySlug);

    @Query("SELECT COALESCE(MAX(t.sortOrder), -1) FROM ResourceTopic t " +
            "WHERE t.category.id = :categoryId")
    int findMaxSortOrderByCategoryId(@Param("categoryId") UUID categoryId);
}