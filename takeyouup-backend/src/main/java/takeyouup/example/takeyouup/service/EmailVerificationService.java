package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private static final int LINK_VALID_HOURS = 24;

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    /**
     * Issues a verification token and emails the link.
     *
     * @param origin the browser origin the signup came from, so the link lands
     *               on the frontend page rather than a hardcoded host
     */
    public void createAndSend(User user, String origin) {
        if (user.isEmailVerified()) {
            return;
        }

        EmailVerificationToken token = tokenRepository.save(EmailVerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(LINK_VALID_HOURS))
                .used(false)
                .build());

        emailService.sendVerificationEmail(user.getEmail(), user.getName(),
                origin + "/verify-email?token=" + token.getToken());
    }

    /** Marks the user's email as verified if the token is valid. */
    public void verify(String tokenValue) {
        EmailVerificationToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification link"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("This verification link has expired. Request a new one.");
        }

        User user = token.getUser();
        if (token.isUsed()) {
            // Re-opening the link (mail clients prefetch, users double-click) is
            // not an error once the account is already confirmed.
            if (user.isEmailVerified()) {
                return;
            }
            throw new IllegalStateException("This verification link has already been used.");
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
        log.info("Email verified for {}", user.getEmail());
    }
}
