package takeyouup.example.takeyouup.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.exception.TooManyRequestsException;
import takeyouup.example.takeyouup.model.PasswordResetToken;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.repository.PasswordResetTokenRepository;
import takeyouup.example.takeyouup.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * "Forgot password" flow.
 *
 * Requesting a reset never reveals whether an address is registered — the
 * controller answers the same way either way — so this endpoint can't be used
 * to enumerate accounts.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int LINK_VALID_MINUTES = 60;
    /** Cap on reset emails per account per hour, so nobody's inbox can be flooded. */
    private static final int MAX_REQUESTS_PER_HOUR = 5;
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public void requestReset(String email, String origin) {
        Optional<User> found = userRepository.findByEmail(email == null ? "" : email.trim());
        if (found.isEmpty()) {
            log.info("Password reset requested for unknown address {}", email);
            return;
        }
        User user = found.get();

        long recent = tokenRepository.countByUserAndCreatedAtAfter(user, LocalDateTime.now().minusHours(1));
        if (recent >= MAX_REQUESTS_PER_HOUR) {
            throw new TooManyRequestsException(
                    "Too many reset requests for this account. Please try again later.");
        }

        // Only the newest link should work.
        tokenRepository.invalidateAllForUser(user);

        PasswordResetToken token = tokenRepository.save(PasswordResetToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(LINK_VALID_MINUTES))
                .used(false)
                .createdAt(LocalDateTime.now())
                .build());

        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(),
                origin + "/reset-password?token=" + token.getToken());
    }

    /** Validates a link without consuming it, so the form can fail fast. */
    public void checkToken(String tokenValue) {
        loadUsableToken(tokenValue);
    }

    @Transactional
    public void resetPassword(String tokenValue, String newPassword) {
        if (newPassword == null || newPassword.trim().length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException(
                    "Password must be at least " + MIN_PASSWORD_LENGTH + " characters long");
        }

        PasswordResetToken token = loadUsableToken(tokenValue);
        User user = token.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        // Someone who proved control of the mailbox has effectively verified it.
        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
        log.info("Password reset completed for {}", user.getEmail());
    }

    private PasswordResetToken loadUsableToken(String tokenValue) {
        PasswordResetToken token = tokenRepository.findByToken(tokenValue == null ? "" : tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("This reset link is not valid."));

        if (token.isUsed()) {
            throw new IllegalStateException("This reset link has already been used.");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("This reset link has expired. Request a new one.");
        }
        return token;
    }
}
