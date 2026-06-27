package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.ProgressRequest;
import takeyouup.example.takeyouup.dto.ProgressResponse;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.model.UserProgress;
import takeyouup.example.takeyouup.repository.UserProgressRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserService userService;

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

        UserProgress saved = progressRepository.save(progress);

        return ProgressResponse.builder()
                .itemType(saved.getItemType())
                .itemId(saved.getItemId())
                .completed(saved.isCompleted())
                .build();
    }
}
