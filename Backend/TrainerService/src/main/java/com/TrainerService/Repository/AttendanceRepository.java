package com.TrainerService.Repository;


import com.TrainerService.Entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUserId(Long userId);

    List<Attendance> findByTrainerId(Long trainerId);

    List<Attendance> findByUserIdAndTrainerId(Long userId, Long trainerId);
}
