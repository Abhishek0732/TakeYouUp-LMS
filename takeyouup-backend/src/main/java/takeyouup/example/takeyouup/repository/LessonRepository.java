package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import takeyouup.example.takeyouup.model.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
