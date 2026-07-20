package takeyouup.example.takeyouup.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import takeyouup.example.takeyouup.exception.TooManyRequestsException;

import static org.junit.jupiter.api.Assertions.*;

class LoginRateLimiterTest {

    private LoginRateLimiter limiter;

    @BeforeEach
    void setUp() {
        limiter = new LoginRateLimiter();
        ReflectionTestUtils.setField(limiter, "maxAttempts", 3);
        ReflectionTestUtils.setField(limiter, "windowMinutes", 15L);
    }

    @Test
    void blocksAfterMaxFailures() {
        String key = "user@x.com";
        for (int i = 0; i < 3; i++) {
            limiter.checkAllowed(key);   // allowed
            limiter.recordFailure(key);
        }
        assertThrows(TooManyRequestsException.class, () -> limiter.checkAllowed(key));
    }

    @Test
    void successResetsCounter() {
        String key = "user@x.com";
        limiter.recordFailure(key);
        limiter.recordFailure(key);
        limiter.reset(key);
        assertDoesNotThrow(() -> limiter.checkAllowed(key));
    }
}
