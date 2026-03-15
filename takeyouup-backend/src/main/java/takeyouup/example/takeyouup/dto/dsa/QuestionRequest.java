package takeyouup.example.takeyouup.dto.dsa;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class QuestionRequest {

    private String title;
    private String url;

    private String topic;
    private String platform;
    private String difficulty;



}
