package takeyouup.example.takeyouup.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import takeyouup.example.takeyouup.enums.Role;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private takeyouup.example.takeyouup.model.User user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey",
                "test-secret-test-secret-test-secret-test-secret-test-secret");
        ReflectionTestUtils.setField(jwtService, "accessExpirationMs", 900000L);
        ReflectionTestUtils.setField(jwtService, "refreshExpirationMs", 604800000L);

        user = takeyouup.example.takeyouup.model.User.builder()
                .email("a@b.com").name("A").role(Role.USER).build();
    }

    @Test
    void accessTokenIsValidForMatchingUser() {
        String token = jwtService.generateAccessToken(user);
        UserDetails details = User.withUsername("a@b.com").password("x").authorities(List.of()).build();

        assertEquals("a@b.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, details));
        assertFalse(jwtService.isRefreshTokenValid(token), "access token must not pass refresh validation");
    }

    @Test
    void refreshTokenIsAcceptedOnlyAsRefresh() {
        String refresh = jwtService.generateRefreshToken(user);
        UserDetails details = User.withUsername("a@b.com").password("x").authorities(List.of()).build();

        assertTrue(jwtService.isRefreshTokenValid(refresh));
        assertFalse(jwtService.isTokenValid(refresh, details), "refresh token must not authenticate API calls");
    }
}
