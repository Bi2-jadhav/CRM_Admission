package com.authService.authService.repository;

import java.util.Optional;


import com.authService.authService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}