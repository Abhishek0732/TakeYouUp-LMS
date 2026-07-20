package takeyouup.example.takeyouup.model.dsa;

import jakarta.persistence.*;

@Entity
@Table(name = "difficulties")
public class Difficulty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String level;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Difficulty(Long id, String level) {
        this.id = id;
        this.level = level;
    }

    public Difficulty() {
    }

    @Override
    public String toString() {
        return "Difficulty{" +
                "id=" + id +
                ", level='" + level + '\'' +
                '}';
    }
}
