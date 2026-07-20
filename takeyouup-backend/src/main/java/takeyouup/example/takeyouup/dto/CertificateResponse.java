package takeyouup.example.takeyouup.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CertificateResponse {
    private String serialNo;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private LocalDateTime issuedAt;
}
