package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.UserProgress;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUser(User user);
    Optional<UserProgress> findByUserAndItemTypeAndItemId(User user, String itemType, String itemId);
}
