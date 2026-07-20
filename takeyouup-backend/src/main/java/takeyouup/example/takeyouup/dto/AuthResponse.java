package takeyouup.example.takeyouup.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    /** Access token (kept as "token" for backward compatibility with the client). */
    private String token;
    private String refreshToken;
    private String name;
    private String email;
    private String role;
}
