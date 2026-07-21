package takeyouup.example.takeyouup.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendConfirmationEmail(String toEmail, String userName) {
        send(toEmail, "Thank You for Contacting TakeYouUp!",
                "Hi " + userName + ",\n\n"
                        + "Thanks for reaching out to TakeYouUp! "
                        + "We've received your message and will get back to you shortly.\n\n"
                        + "Best Regards,\nThe TakeYouUp Team");
    }

    public void sendVerificationEmail(String toEmail, String userName, String verifyLink) {
        send(toEmail, "Verify your TakeYouUp email",
                "Hi " + userName + ",\n\n"
                        + "Welcome to TakeYouUp! Confirm your email address by opening the link below:\n\n"
                        + verifyLink + "\n\n"
                        + "This link expires in 24 hours. If you didn't create this account you can ignore this email.\n\n"
                        + "Best Regards,\nThe TakeYouUp Team");
    }

    public void sendPasswordResetEmail(String toEmail, String userName, String resetLink) {
        send(toEmail, "Reset your TakeYouUp password",
                "Hi " + userName + ",\n\n"
                        + "We received a request to reset your TakeYouUp password. "
                        + "Choose a new one here:\n\n"
                        + resetLink + "\n\n"
                        + "This link expires in 60 minutes and can only be used once.\n"
                        + "If you didn't ask for a reset, ignore this email — your password stays unchanged.\n\n"
                        + "Best Regards,\nThe TakeYouUp Team");
    }

    /**
     * Sends the message, logging the body if the transport is unavailable.
     * Mail is always best-effort: a dead SMTP server must never break signup or
     * a password reset, and the logged copy keeps the flow testable.
     */
    private void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        try {
            mailSender.send(message);
            log.info("Sent '{}' to {}", subject, to);
        } catch (Exception e) {
            log.warn("Could not email '{}' to {} ({}). Message body follows so the "
                    + "flow can still be completed:\n{}", subject, to, e.getMessage(), body);
        }
    }
}
