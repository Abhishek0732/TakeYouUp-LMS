package takeyouup.example.takeyouup.model.quiz;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "course_id")
    private Long courseId;

    @Column(columnDefinition = "json")
    private String questionsJson;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getQuestionsJson() {
        return questionsJson;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setQuestionsJson(String questionsJson) {
        this.questionsJson = questionsJson;
    }
}
