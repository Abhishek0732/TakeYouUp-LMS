package takeyouup.example.takeyouup.dto.dsa;

public class QuestionDTO {

    private Long id;
    private String title;
    private String url;
    private String topic;
    private String difficulty;
    private String platform;

    public QuestionDTO(Long id, String title, String url,
                       String topic, String difficulty, String platform) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.topic = topic;
        this.difficulty = difficulty;
        this.platform = platform;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }
}
