package takeyouup.example.takeyouup.repository.dsa;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.dsa.Topic;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    Topic findByName(String name);

}
