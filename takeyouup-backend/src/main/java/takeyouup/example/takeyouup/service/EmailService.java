package takeyouup.example.takeyouup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail(String toEmail, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Thank You for Contacting TakeYouUp!");
        message.setText("Hi " + userName + ",\n\n"
                + "Thanks for reaching out to TakeYouUp! "
                + "We’ve received your message and will get back to you shortly.\n\n"
                + "Best Regards,\nThe TakeYouUp Team");
        mailSender.send(message);
    }
}
