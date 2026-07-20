package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.EmailVerificationToken;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.repository.EmailVerificationTokenRepository;
import takeyouup.example.takeyouup.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.base-url}")
    private String baseUrl;

    /** Creates a verification token and (best-effort) emails a verification link. */
    public void createAndSend(User user) {
        EmailVerificationToken token = tokenRepository.save(EmailVerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .build());

        String link = baseUrl.trim().replaceAll("/+$", "")
                + "/api/auth/verify?token=" + token.getToken();

        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), link);
        } catch (Exception e) {
            // SMTP is optional; never fail registration because email couldn't be sent.
            log.warn("Verification email not sent to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    /** Marks the user's email as verified if the token is valid. */
    public void verify(String tokenValue) {
        EmailVerificationToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));

        if (token.isUsed()) {
            throw new IllegalStateException("This verification link has already been used.");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("This verification link has expired.");
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }
}
