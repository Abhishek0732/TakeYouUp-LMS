package takeyouup.example.takeyouup.controller.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.model.dsa.Platform;
import takeyouup.example.takeyouup.service.dsa.PlatformService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/platforms")
@RequiredArgsConstructor
public class PlatformController {

    private final PlatformService platformService;

    @PostMapping
    public Platform createPlatform(@RequestBody Map<String, String> body) {

        return platformService.createPlatform(body.get("name"));
    }

    @GetMapping
    public List<Platform> getAllPlatforms() {

        return platformService.getAllPlatforms();
    }

    @PutMapping("/{id}")
    public Platform updatePlatform(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        return platformService.updatePlatform(id, body.get("name"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        platformService.deletePlatform(id);
    }
}
