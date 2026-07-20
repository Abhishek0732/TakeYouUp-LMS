package takeyouup.example.takeyouup.service.dsa;

import takeyouup.example.takeyouup.model.dsa.Platform;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.repository.dsa.PlatformRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlatformService {

    private final PlatformRepository platformRepository;

    public Platform createPlatform(String name) {

        Platform existing = platformRepository.findByName(name);

        if (existing != null) {
            throw new RuntimeException("Platform already exists");
        }

        Platform platform = new Platform();
        platform.setName(name);

        return platformRepository.save(platform);
    }

    public List<Platform> getAllPlatforms() {

        return platformRepository.findAll();
    }

    public Optional<Platform> getPlatformByName(String name) {

        return platformRepository.findByNameIgnoreCase(name);
    }

    public Platform updatePlatform(Long id, String name) {

        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platform not found"));

        Platform existing = platformRepository.findByName(name);

        if (existing != null && !existing.getId().equals(id)) {
            throw new RuntimeException("Platform name already exists");
        }

        platform.setName(name);

        return platformRepository.save(platform);
    }

    public void deletePlatform(Long id) {
        platformRepository.deleteById(id);
    }
}
