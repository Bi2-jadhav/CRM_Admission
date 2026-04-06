package com.authService.authService.Service;

import com.authService.authService.Entity.User;
import com.authService.authService.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // ✅ REGISTER USER
    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // ✅ GET USER BY EMAIL (LOGIN)
    public User getByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ GET ALL USERS
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // ✅ GET USER BY ID
    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ UPDATE USER
    public User updateUser(Long id, User updated) {
        User user = getById(id);

        user.setEmail(updated.getEmail());
        user.setRole(updated.getRole());

        // Update password only if provided
        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(updated.getPassword()));
        }

        return repo.save(user);
    }

    // ✅ DELETE USER
    public void deleteUser(Long id) {
        repo.deleteById(id);
    }
}