package takeyouup.example.takeyouup.dto.dsa;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String title;
    private String url;
    private String topic;
    private String difficulty;
    private String platform;
}