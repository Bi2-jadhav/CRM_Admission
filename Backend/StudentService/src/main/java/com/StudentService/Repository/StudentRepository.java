package com.StudentService.Repository;

import com.StudentService.Entity.Attendance;
import com.StudentService.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUserId(Long userId); // ✅ ADD THIS
    List<Student> findByTrainerId(Long trainerId);
}
