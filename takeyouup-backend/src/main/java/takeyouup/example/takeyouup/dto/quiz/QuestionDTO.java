package takeyouup.example.takeyouup.dto.quiz;

import java.util.List;

public class QuestionDTO {

    private String question;
    private List<String> options;
    private int correct;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public int getCorrect() {
        return correct;
    }

    public void setCorrect(int correct) {
        this.correct = correct;
    }
}
