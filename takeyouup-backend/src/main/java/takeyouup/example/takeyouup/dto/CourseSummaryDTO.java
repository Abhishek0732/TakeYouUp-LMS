package takeyouup.example.takeyouup.dto;

public class CourseSummaryDTO {
    private Long id;
    private String courseId;
    private String slug;
    private String title;
    private String description;
    private String category;
    private String level;
    private String duration;
    private int students;
    private double rating;
    private String image;
    private String instructor;
    private String price;

    // Constructor
    public CourseSummaryDTO(Long id, String courseId, String slug, String title, String description,
                            String category, String level, String duration, int students,
                            double rating, String image, String instructor, String price) {
        this.id = id;
        this.courseId = courseId;
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.category = category;
        this.level = level;
        this.duration = duration;
        this.students = students;
        this.rating = rating;
        this.image = image;
        this.instructor = instructor;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public int getStudents() {
        return students;
    }

    public void setStudents(int students) {
        this.students = students;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }
}

