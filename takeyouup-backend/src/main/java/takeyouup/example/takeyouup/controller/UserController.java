package takeyouup.example.takeyouup.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.UpdateNameRequest;
import takeyouup.example.takeyouup.dto.UpdateRoleRequest;
import takeyouup.example.takeyouup.dto.UserSummaryResponse;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    /** Admin-only listing (never exposes password hashes). */
    @GetMapping
    public List<UserSummaryResponse> getAllUsers() {
        return userService.getAllUsers().stream().map(this::toSummary).toList();
    }

    @PutMapping("/update-name")
    public ResponseEntity<?> updateName(
            @RequestBody UpdateNameRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(toSummary(userService.updateUserName(email, request.getName())));
    }

    @PutMapping("/{id}/role")
    public UserSummaryResponse updateRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return toSummary(userService.updateRole(id, request.getRole()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private UserSummaryResponse toSummary(User u) {
        return UserSummaryResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole() != null ? u.getRole().name() : null)
                .emailVerified(u.isEmailVerified())
                .build();
    }
}
