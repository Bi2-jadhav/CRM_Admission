package com.authService.authService.Service;

import com.authService.authService.Entity.User;
import com.authService.authService.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final RestTemplate restTemplate;

    public UserService(UserRepository repo, PasswordEncoder encoder, RestTemplate restTemplate) {
        this.repo = repo;
        this.encoder = encoder;
        this.restTemplate = restTemplate;
    }

    // ✅ REGISTER USER
    public User register(com.authService.authService.Entity.User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        com.authService.authService.Entity.User savedUser = repo.save(user);

        try {
            if ("TRAINER".equalsIgnoreCase(savedUser.getRole())) {
                com.authService.authService.Dto.TrainerDTO trainer = new com.authService.authService.Dto.TrainerDTO();
                trainer.setUserId(savedUser.getId());
                trainer.setName(savedUser.getName());
                trainer.setEmail(savedUser.getEmail());
                trainer.setSpeciality("To be updated");
                trainer.setExperience(0);

                restTemplate.postForObject("http://localhost:8080/api/trainer", trainer, Object.class);
            } else if ("STUDENT".equalsIgnoreCase(savedUser.getRole())) {
                com.authService.authService.Dto.StudentDTO student = new com.authService.authService.Dto.StudentDTO();
                student.setUserId(savedUser.getId());
                student.setName(savedUser.getName());
                student.setEmail(savedUser.getEmail());

                restTemplate.postForObject("http://localhost:8080/api/student", student, Object.class);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Failed to create profile in microservice: " + e.getMessage());
        }

        return savedUser;
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