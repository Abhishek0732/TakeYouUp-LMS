package takeyouup.example.takeyouup.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.UpdateNameRequest;
import takeyouup.example.takeyouup.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @RequestMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-name")
    public ResponseEntity<?> updateName(
            @RequestBody UpdateNameRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        try {
            return ResponseEntity.ok(userService.updateUserName(email,  request.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
