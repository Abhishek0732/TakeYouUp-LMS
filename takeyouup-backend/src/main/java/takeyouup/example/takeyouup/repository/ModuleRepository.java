package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import takeyouup.example.takeyouup.model.CourseModule;

@Repository
public interface ModuleRepository extends JpaRepository<CourseModule, Long> {
}
