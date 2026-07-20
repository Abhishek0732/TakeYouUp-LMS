package takeyouup.example.takeyouup.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.CertificateResponse;
import takeyouup.example.takeyouup.service.CertificateService;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin
public class CertificateController {

    private final CertificateService certificateService;

    /** Claim a certificate for a completed course (current user). */
    @PostMapping("/courses/{courseId}")
    public CertificateResponse issue(@PathVariable Long courseId) {
        return certificateService.issueForCourse(courseId);
    }

    @GetMapping("/mine")
    public List<CertificateResponse> mine() {
        return certificateService.myCertificates();
    }

    /** Public verification by serial number. */
    @GetMapping("/verify/{serialNo}")
    public CertificateResponse verify(@PathVariable String serialNo) {
        return certificateService.verify(serialNo);
    }
}
