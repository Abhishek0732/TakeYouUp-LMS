package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.UserProgress;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUser(User user);

    /**
     * Completed item ids for ONE type. The profile only needs lesson ids —
     * loading every row via findByUser drags in a power user's entire solved-
     * problem history (tens of thousands of rows) to throw most of it away.
     */
    @Query("""
        SELECT p.itemId FROM UserProgress p
        WHERE p.user = :user AND p.itemType = :itemType AND p.completed = true
    """)
    List<String> findCompletedItemIds(@Param("user") User user, @Param("itemType") String itemType);

    long countByUserAndItemTypeAndCompletedTrue(User user, String itemType);
    Optional<UserProgress> findByUserAndItemTypeAndItemId(User user, String itemType, String itemId);

    /** Counts completed items for a user within a set of ids — used by course summaries. */
    /**
     * Includes itemType so (a) a solved DSA question with id "42" can no longer
     * be mistaken for lesson 42, and (b) the query can use
     * uk_user_progress_item (user_id, item_type, item_id) as a range scan
     * instead of scanning every completed row for the user.
     */
    long countByUserAndItemTypeAndCompletedTrueAndItemIdIn(
            User user, String itemType, Collection<String> itemIds);
}
