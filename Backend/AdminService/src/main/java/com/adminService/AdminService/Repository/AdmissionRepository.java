package com.adminService.AdminService.Repository;

import com.adminService.AdminService.Entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
}