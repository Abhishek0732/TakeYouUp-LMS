package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.CertificateResponse;
import takeyouup.example.takeyouup.dto.ProgressSummaryResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.Certificate;
import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.repository.CertificateRepository;
import takeyouup.example.takeyouup.repository.CourseRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserProgressService progressService;
    private final UserService userService;

    /** Issues a certificate for the current user IF the course is fully completed. */
    public CertificateResponse issueForCourse(Long courseId) {
        User user = userService.getCurrentUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        ProgressSummaryResponse summary = progressService.getCourseSummary(courseId);
        if (!summary.isCompleted()) {
            throw new IllegalStateException(
                    "Complete all lessons before claiming your certificate ("
                            + summary.getCompletedLessons() + "/" + summary.getTotalLessons() + ").");
        }

        Certificate certificate = certificateRepository.findByUserAndCourseId(user, courseId)
                .orElseGet(() -> certificateRepository.save(Certificate.builder()
                        .serialNo(generateSerial())
                        .user(user)
                        .courseId(courseId)
                        .issuedAt(LocalDateTime.now())
                        .build()));

        return toResponse(certificate, user.getName(), course.getTitle());
    }

    public List<CertificateResponse> myCertificates() {
        User user = userService.getCurrentUser();
        return certificateRepository.findByUser(user).stream()
                .map(c -> toResponse(c, user.getName(), courseTitle(c.getCourseId())))
                .toList();
    }

    /** Public verification of a certificate by serial number. */
    public CertificateResponse verify(String serialNo) {
        Certificate certificate = certificateRepository.findBySerialNo(serialNo)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        return toResponse(certificate, certificate.getUser().getName(),
                courseTitle(certificate.getCourseId()));
    }

    private String courseTitle(Long courseId) {
        return courseRepository.findById(courseId).map(Course::getTitle).orElse("Course");
    }

    private String generateSerial() {
        return "TYU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private CertificateResponse toResponse(Certificate c, String userName, String courseTitle) {
        return CertificateResponse.builder()
                .serialNo(c.getSerialNo())
                .userName(userName)
                .courseId(c.getCourseId())
                .courseTitle(courseTitle)
                .issuedAt(c.getIssuedAt())
                .build();
    }
}
