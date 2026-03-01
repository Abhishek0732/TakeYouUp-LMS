package takeyouup.example.takeyouup.event;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import takeyouup.example.takeyouup.service.EmailService;

@Component
public class ContactMessageEventListener {

    private final EmailService emailService;

    public ContactMessageEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @EventListener
    public void handleContactMessageEvent(ContactMessageEvent event) {

        emailService.sendConfirmationEmail(
                event.getEmail(),
                event.getName()
        );
    }
}
