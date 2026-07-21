package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.ProgressRequest;
import takeyouup.example.takeyouup.dto.ProgressResponse;
import takeyouup.example.takeyouup.dto.ProgressSummaryResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.UserProgress;
import takeyouup.example.takeyouup.repository.CourseRepository;
import takeyouup.example.takeyouup.repository.LessonRepository;
import takeyouup.example.takeyouup.repository.UserProgressRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserService userService;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    /**
     * Per-course completion summary for the current user. Uses two lean queries
     * (lesson-id projection + a COUNT) instead of loading the whole course graph
     * or every progress row, so it stays fast regardless of table size.
     */
    public ProgressSummaryResponse getCourseSummary(Long courseId) {
        User currentUser = userService.getCurrentUser();

        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found");
        }

        List<String> lessonIds = lessonRepository.findLessonIdsByCourseId(courseId).stream()
                .map(String::valueOf)
                .toList();

        int total = lessonIds.size();
        long completed = lessonIds.isEmpty() ? 0
                : progressRepository.countByUserAndItemTypeAndCompletedTrueAndItemIdIn(currentUser, "LESSON", lessonIds);

        int percent = total == 0 ? 0 : (int) Math.round((completed * 100.0) / total);

        return ProgressSummaryResponse.builder()
                .courseId(courseId)
                .totalLessons(total)
                .completedLessons((int) completed)
                .percent(percent)
                .completed(total > 0 && completed >= total)
                .build();
    }

    public List<ProgressResponse> getCurrentUserProgress() {
        User currentUser = userService.getCurrentUser();
        return progressRepository.findByUser(currentUser).stream()
                .map(p -> ProgressResponse.builder()
                        .itemType(p.getItemType())
                        .itemId(p.getItemId())
                        .completed(p.isCompleted())
                        .build())
                .collect(Collectors.toList());
    }

    public ProgressResponse toggleProgress(ProgressRequest request) {
        User currentUser = userService.getCurrentUser();
        Optional<UserProgress> optionalProgress = progressRepository.findByUserAndItemTypeAndItemId(
                currentUser, request.getItemType(), request.getItemId());

        UserProgress progress;
        if (optionalProgress.isPresent()) {
            progress = optionalProgress.get();
            progress.setCompleted(!progress.isCompleted());
        } else {
            progress = UserProgress.builder()
                    .user(currentUser)
                    .itemType(request.getItemType())
                    .itemId(request.getItemId())
                    .completed(true)
                    .build();
        }

        // Stamp the moment it was completed; clearing it on un-complete keeps a
        // toggled-off item from propping up the streak.
        progress.setCompletedAt(progress.isCompleted() ? LocalDateTime.now() : null);

        UserProgress saved = progressRepository.save(progress);

        return ProgressResponse.builder()
                .itemType(saved.getItemType())
                .itemId(saved.getItemId())
                .completed(saved.isCompleted())
                .build();
    }
}
