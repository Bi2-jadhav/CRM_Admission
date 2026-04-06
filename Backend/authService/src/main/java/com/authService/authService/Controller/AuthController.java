package com.authService.authService.Controller;

import com.authService.authService.Dto.AuthResponse;
import com.authService.authService.Dto.LoginRequest;
import com.authService.authService.Entity.User;
import com.authService.authService.Service.JwtService;
import com.authService.authService.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;

    public AuthController(UserService userService,
                          JwtService jwtService,
                          PasswordEncoder encoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.encoder = encoder;
    }

    // ===== PUBLIC AUTH =====

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        User user = userService.getByEmail(request.getEmail());
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token);
    }

    // ===== USERS CRUD (Admin protected) =====

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.register(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updated) {
        return userService.updateUser(id, updated);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

