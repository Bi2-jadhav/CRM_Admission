package com.StudentService.Service;

import com.StudentService.Entity.Attendance;
import com.StudentService.Repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // ✅ Get attendance by student
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    // ✅ Mark attendance (create)
    public Attendance markAttendance(Long studentId, boolean present) {
        Attendance attendance = new Attendance();
        attendance.setStudentId(studentId);
        attendance.setDate(LocalDate.now());
        attendance.setPresent(present);

        return attendanceRepository.save(attendance);
    }

    // ✅ Save custom attendance (if date provided)
    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // ✅ Delete attendance
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    // ✅ Update attendance
    public Attendance updateAttendance(Long id, boolean present) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setPresent(present);
        return attendanceRepository.save(attendance);
    }
}