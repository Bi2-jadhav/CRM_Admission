package com.adminService.AdminService.Repository;

import com.adminService.AdminService.Entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByUserId(Long userId);

    List<Admission> findByTrainerId(Long trainerId);
}