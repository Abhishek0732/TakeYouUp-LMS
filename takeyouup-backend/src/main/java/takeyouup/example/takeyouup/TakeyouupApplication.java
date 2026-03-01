package takeyouup.example.takeyouup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TakeyouupApplication {

	public static void main(String[] args) {
		SpringApplication.run(TakeyouupApplication.class, args);
	}

}
