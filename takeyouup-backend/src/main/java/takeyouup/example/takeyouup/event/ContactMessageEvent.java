package takeyouup.example.takeyouup.event;

public class ContactMessageEvent {

    private final String email;
    private final String name;

    public ContactMessageEvent(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}
