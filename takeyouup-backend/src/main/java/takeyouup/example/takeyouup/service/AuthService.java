package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.config.JwtService;
import takeyouup.example.takeyouup.dto.AuthResponse;
import takeyouup.example.takeyouup.dto.LoginRequest;
import takeyouup.example.takeyouup.dto.RegisterRequest;
import takeyouup.example.takeyouup.enums.Role;
import takeyouup.example.takeyouup.exception.DuplicateResourceException;
import takeyouup.example.takeyouup.exception.EmailNotVerifiedException;
import takeyouup.example.takeyouup.exception.InvalidCredentialsException;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginRateLimiter loginRateLimiter;
    private final EmailVerificationService emailVerificationService;

    @Value("${app.auth.require-verified-email:false}")
    private boolean requireVerifiedEmail;

    // ✅ Register User
    public AuthResponse register(RegisterRequest request, String origin) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Default role
                .emailVerified(false)
                .build();

        userRepository.save(user);
        emailVerificationService.createAndSend(user, origin);

        return buildAuthResponse(user);
    }

    public void verifyEmail(String token) {
        emailVerificationService.verify(token);
    }

    /**
     * Sends a fresh verification link. Answers the same way for unknown and
     * already-verified addresses so the endpoint can't confirm who has an
     * account here.
     */
    public void resendVerification(String email, String origin) {
        userRepository.findByEmail(email == null ? "" : email.trim())
                .ifPresent(user -> emailVerificationService.createAndSend(user, origin));
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail();

        // Reject early if this account is currently rate limited.
        loginRateLimiter.checkAllowed(email);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException e) {
            loginRateLimiter.recordFailure(email);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        loginRateLimiter.reset(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (requireVerifiedEmail && !user.isEmailVerified()) {
            throw new EmailNotVerifiedException(
                    "Please verify your email before logging in. Check your inbox for the link.");
        }

        return buildAuthResponse(user);
    }

    /** Exchange a valid refresh token for a fresh access/refresh pair. */
    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null || !jwtService.isRefreshTokenValid(refreshToken)) {
            throw new InvalidCredentialsException("Invalid or expired refresh token");
        }
        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .token(jwtService.generateAccessToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .build();
    }
}
