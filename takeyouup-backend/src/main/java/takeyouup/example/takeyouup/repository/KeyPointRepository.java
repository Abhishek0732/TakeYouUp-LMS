package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import takeyouup.example.takeyouup.model.KeyPoint;

@Repository
public interface KeyPointRepository extends JpaRepository<KeyPoint, Long> {
}
