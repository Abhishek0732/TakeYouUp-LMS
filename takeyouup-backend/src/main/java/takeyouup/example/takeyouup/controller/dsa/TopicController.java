package takeyouup.example.takeyouup.controller.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.model.dsa.Platform;
import takeyouup.example.takeyouup.model.dsa.Topic;
import takeyouup.example.takeyouup.service.dsa.TopicService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public Topic createTopic(@RequestBody Map<String, String> body) {

        return topicService.createTopic(body.get("name"));
    }

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicService.getAllTopics();
    }

    @PutMapping("/{id}")
    public Topic updateTopic(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        return topicService.updateTopic(id, body.get("name"));
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
    }
}
