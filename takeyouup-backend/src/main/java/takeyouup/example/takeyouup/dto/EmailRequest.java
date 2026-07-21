package takeyouup.example.takeyouup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Body for endpoints that only take an address: forgot-password, resend-verification. */
@Data
public class EmailRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;
}
