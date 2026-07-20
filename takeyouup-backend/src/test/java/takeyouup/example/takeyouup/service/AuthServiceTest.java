package takeyouup.example.takeyouup.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import takeyouup.example.takeyouup.config.JwtService;
import takeyouup.example.takeyouup.dto.AuthResponse;
import takeyouup.example.takeyouup.dto.RegisterRequest;
import takeyouup.example.takeyouup.enums.Role;
import takeyouup.example.takeyouup.exception.DuplicateResourceException;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.repository.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;
    @Mock LoginRateLimiter loginRateLimiter;
    @Mock EmailVerificationService emailVerificationService;

    @InjectMocks AuthService authService;

    private RegisterRequest request(String email) {
        RegisterRequest r = new RegisterRequest();
        r.setName("Test");
        r.setEmail(email);
        r.setPassword("secret123");
        return r;
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmail("dup@x.com")).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> authService.register(request("dup@x.com")));
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerCreatesUserAndReturnsTokens() {
        when(userRepository.existsByEmail("new@x.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashed");
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        AuthResponse res = authService.register(request("new@x.com"));

        assertEquals("access-token", res.getToken());
        assertEquals("refresh-token", res.getRefreshToken());
        assertEquals(Role.USER.name(), res.getRole());
        verify(userRepository).save(any(User.class));
        verify(emailVerificationService).createAndSend(any(User.class));
    }
}
