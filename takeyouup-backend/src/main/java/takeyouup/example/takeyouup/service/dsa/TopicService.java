package takeyouup.example.takeyouup.service.dsa;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.model.dsa.Platform;
import takeyouup.example.takeyouup.model.dsa.Topic;
import takeyouup.example.takeyouup.repository.dsa.TopicRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    public Topic createTopic(String name) {

        Topic topic = new Topic();
        topic.setName(name);

        return topicRepository.save(topic);
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic updateTopic(Long id, String name) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Topic existing = topicRepository.findByName(name);

        if (existing != null && !existing.getId().equals(id)) {
            throw new RuntimeException("Topic name already exists");
        }

        topic.setName(name);

        return topicRepository.save(topic);
    }
}
