package takeyouup.example.takeyouup.repository.dsa;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.dsa.Platform;

import java.util.Optional;

public interface PlatformRepository extends JpaRepository<Platform, Long> {

    Platform findByName(String name);

    Optional<Platform> findByNameIgnoreCase(String name);
}
