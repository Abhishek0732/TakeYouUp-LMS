package takeyouup.example.takeyouup;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Full-context test. Disabled in the default build because it needs a live
 * MySQL and a Google GenAI key; run it against real infrastructure with
 * {@code -Dtest=TakeyouupApplicationTests -DfailIfNoTests=false} when available.
 */
@Disabled("Requires a running MySQL and Gemini key; covered by the docker-compose integration run")
@SpringBootTest
class TakeyouupApplicationTests {

    @Test
    void contextLoads() {
    }
}
