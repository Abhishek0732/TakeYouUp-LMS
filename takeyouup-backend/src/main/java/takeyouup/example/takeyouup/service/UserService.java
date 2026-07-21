package takeyouup.example.takeyouup.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.exception.ResourceNotFoundException;
import takeyouup.example.takeyouup.model.User;
import takeyouup.example.takeyouup.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(takeyouup.example.takeyouup.enums.Role.valueOf(role.trim().toUpperCase()));
        return userRepository.save(user);
    }

    public User updateUserName(String email, String newName) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(newName);

        return userRepository.save(user);
    }

    /**
     * Changes the signed-in user's password after re-checking the current one,
     * so a walk-up on an unlocked screen can't silently take over the account.
     */
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            // 400, not 401: the request is authenticated, it's the form field
            // that is wrong. A 401 here would make the client burn a token
            // refresh and retry before showing the error.
            throw new IllegalArgumentException("Your current password is not correct");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("The new password must be different from the current one");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
