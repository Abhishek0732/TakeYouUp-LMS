package takeyouup.example.takeyouup.service.team;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import takeyouup.example.takeyouup.dto.team.TeamMemberRequest;
import takeyouup.example.takeyouup.dto.team.TeamMemberResponse;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.team.TeamMember;
import takeyouup.example.takeyouup.repository.team.TeamMemberRepository;
import takeyouup.example.takeyouup.service.FileStorageService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamMemberRepository repository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getAll() {
        return repository.findAllByOrderBySortOrderAscNameAsc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public TeamMemberResponse create(TeamMemberRequest req, MultipartFile image) throws IOException {
        validate(req);
        TeamMember member = TeamMember.builder()
                .name(req.getName().trim())
                .role(trimToNull(req.getRole()))
                .bio(trimToNull(req.getBio()))
                .sortOrder(req.getSortOrder() != null ? req.getSortOrder() : nextSortOrder())
                .build();
        if (image != null && !image.isEmpty()) {
            member.setPhotoUrl(FileStorageService.publicUrl(fileStorageService.storeImage(image, "team")));
        }
        return toResponse(repository.save(member));
    }

    @Transactional
    public TeamMemberResponse update(UUID id, TeamMemberRequest req, MultipartFile image) throws IOException {
        validate(req);
        TeamMember member = find(id);
        member.setName(req.getName().trim());
        member.setRole(trimToNull(req.getRole()));
        member.setBio(trimToNull(req.getBio()));
        if (req.getSortOrder() != null) {
            member.setSortOrder(req.getSortOrder());
        }
        if (image != null && !image.isEmpty()) {
            String previous = member.getPhotoUrl();
            member.setPhotoUrl(FileStorageService.publicUrl(fileStorageService.storeImage(image, "team")));
            fileStorageService.deleteQuietly(previous);   // best-effort; ignores null/external
        }
        return toResponse(repository.save(member));
    }

    @Transactional
    public void delete(UUID id) {
        TeamMember member = find(id);
        fileStorageService.deleteQuietly(member.getPhotoUrl());
        repository.delete(member);
    }

    @Transactional
    public TeamMemberResponse clearPhoto(UUID id) {
        TeamMember member = find(id);
        fileStorageService.deleteQuietly(member.getPhotoUrl());
        member.setPhotoUrl(null);
        return toResponse(repository.save(member));
    }

    private TeamMember find(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found"));
    }

    private void validate(TeamMemberRequest req) {
        if (req == null || req.getName() == null || req.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
    }

    private int nextSortOrder() {
        return repository.findAll().stream().mapToInt(TeamMember::getSortOrder).max().orElse(0) + 1;
    }

    private static String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private TeamMemberResponse toResponse(TeamMember m) {
        return TeamMemberResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .role(m.getRole())
                .bio(m.getBio())
                .photoUrl(m.getPhotoUrl())
                .sortOrder(m.getSortOrder())
                .createdAt(m.getCreatedAt())
                .updatedAt(m.getUpdatedAt())
                .build();
    }
}
