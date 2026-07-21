package takeyouup.example.takeyouup.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Mail transport that works out of the box and upgrades itself.
 *
 * With no credentials configured the app talks to the bundled Mailpit test
 * inbox over plain SMTP. The moment {@code MAIL_USERNAME} appears in the
 * environment — Gmail, Mailtrap, SES, anything — authentication and STARTTLS
 * are enabled and that server is used instead. No code or profile change.
 */
@Configuration
public class MailConfig {

    private static final Logger log = LoggerFactory.getLogger(MailConfig.class);

    @Value("${spring.mail.host:mailpit}")
    private String host;

    @Value("${spring.mail.port:1025}")
    private int port;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);

        boolean authenticated = username != null && !username.isBlank();
        if (authenticated) {
            sender.setUsername(username);
            sender.setPassword(password);
        }

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", String.valueOf(authenticated));
        props.put("mail.smtp.starttls.enable", String.valueOf(authenticated));
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        log.info("Mail transport: {}:{} ({})", host, port,
                authenticated ? "authenticated SMTP" : "no auth — test inbox");
        return sender;
    }
}
