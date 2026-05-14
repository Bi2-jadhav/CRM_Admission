package com.TrainerService.Service;

import com.TrainerService.Entity.Attendance;
import com.TrainerService.Repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository repo;

    public AttendanceService(AttendanceRepository repo) {
        this.repo = repo;
    }

    // ✅ Mark attendance
    public Attendance markAttendance(Attendance attendance) {

        System.out.println("DEBUG: Marking attendance for UserID: " + attendance.getUserId() + 
                           ", TrainerID: " + attendance.getTrainerId() + 
                           ", Status: " + attendance.getStatus());

        if (attendance.getUserId() == null) {
            System.err.println("ERROR: User ID is null");
            throw new RuntimeException("User ID is required");
        }

        if (attendance.getTrainerId() == null) {
            System.err.println("ERROR: Trainer ID is null");
            throw new RuntimeException("Trainer ID is required");
        }

        if (attendance.getDate() == null) {
            attendance.setDate(LocalDate.now());
        }

        if (attendance.getStatus() == null) {
            attendance.setStatus("PRESENT");
        }
        
        attendance.setPresent("PRESENT".equalsIgnoreCase(attendance.getStatus()));

        try {
            Attendance saved = repo.save(attendance);
            System.out.println("✅ Attendance saved successfully: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("❌ Database error saving attendance: " + e.getMessage());
            throw new RuntimeException("Failed to save attendance: " + e.getMessage());
        }
    }
    // ✅ Get attendance by student
    public List<Attendance> getByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    // ✅ Calculate percentage
    public double getAttendancePercentage(Long userId) {

        List<Attendance> list = repo.findByUserId(userId);

        if (list.isEmpty()) return 0;

        long present = list.stream()
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()))
                .count();

        return (present * 100.0) / list.size();
    }
}