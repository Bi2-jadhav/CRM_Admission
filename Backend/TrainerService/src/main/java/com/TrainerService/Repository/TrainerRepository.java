package com.TrainerService.Repository;
import com.TrainerService.Entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {

    // 🔍 Find trainer by email (useful for login or validation)
    Trainer findByEmail(String email);

    // 🔍 Find trainers by speciality (for filtering)
    List<Trainer> findBySpeciality(String speciality);

    // 🔍 Find trainers with experience greater than given years
    List<Trainer> findByExperienceGreaterThan(int years);

    Trainer findByUserId(Long userId);
}