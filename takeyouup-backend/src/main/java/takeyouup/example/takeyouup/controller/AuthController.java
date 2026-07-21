package takeyouup.example.takeyouup.controller;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.AuthResponse;
import takeyouup.example.takeyouup.dto.EmailRequest;
import takeyouup.example.takeyouup.dto.LoginRequest;
import takeyouup.example.takeyouup.dto.RefreshRequest;
import takeyouup.example.takeyouup.dto.RegisterRequest;
import takeyouup.example.takeyouup.dto.ResetPasswordRequest;
import takeyouup.example.takeyouup.service.AuthService;
import takeyouup.example.takeyouup.service.PasswordResetService;
import takeyouup.example.takeyouup.util.RequestOrigin;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    /** Used only when the request carries no usable origin (e.g. curl). */
    @Value("${app.frontend-url:http://localhost:5174}")
    private String frontendUrlFallback;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest servletRequest) {

        return ResponseEntity.ok(authService.register(request, origin(servletRequest)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshRequest request) {

        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    // ------------------------------------------------------ email verification

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(
            @Valid @RequestBody EmailRequest request,
            HttpServletRequest servletRequest) {

        authService.resendVerification(request.getEmail(), origin(servletRequest));
        // Deliberately identical for known and unknown addresses.
        return ResponseEntity.ok(Map.of(
                "message", "If that address has an account, a new verification link is on its way."));
    }

    // -------------------------------------------------------- password reset

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody EmailRequest request,
            HttpServletRequest servletRequest) {

        passwordResetService.requestReset(request.getEmail(), origin(servletRequest));
        // Same answer whether or not the account exists — no enumeration.
        return ResponseEntity.ok(Map.of(
                "message", "If that address has an account, a reset link is on its way."));
    }

    /** Lets the reset page fail fast on a dead link before showing the form. */
    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        passwordResetService.checkToken(token);
        return ResponseEntity.ok(Map.of("valid", true));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated. You can sign in now."));
    }

    /** Emailed links must point back at whichever host is serving the frontend. */
    private String origin(HttpServletRequest request) {
        return RequestOrigin.resolve(request, frontendUrlFallback);
    }
}
