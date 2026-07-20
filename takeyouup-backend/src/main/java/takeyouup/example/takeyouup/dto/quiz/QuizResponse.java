package takeyouup.example.takeyouup.dto.quiz;

import lombok.Data;

import java.util.List;

@Data
public class QuizResponse {

    private Long id;
    private String title;
    private Long courseId;
    private List<QuestionDTO> questions;

    public QuizResponse(Long id, String title, Long courseId, List<QuestionDTO> questions) {
        this.id = id;
        this.title = title;
        this.courseId = courseId;
        this.questions = questions;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }
}
