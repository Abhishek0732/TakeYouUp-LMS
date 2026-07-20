package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.Certificate;
import takeyouup.example.takeyouup.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findBySerialNo(String serialNo);
    Optional<Certificate> findByUserAndCourseId(User user, Long courseId);
    List<Certificate> findByUser(User user);
}
