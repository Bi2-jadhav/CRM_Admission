package com.adminService.AdminService.Repository;

import com.adminService.AdminService.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
