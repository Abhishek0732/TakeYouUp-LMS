package takeyouup.example.takeyouup.dto.quiz;

import lombok.Data;

import java.util.List;

@Data
public class QuizRequest {

    private String title;
    private Long courseId;
    private List<QuestionDTO> questions;

    public String getTitle() {
        return title;
    }

    public Long getCourseId() {
        return courseId;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }
}
