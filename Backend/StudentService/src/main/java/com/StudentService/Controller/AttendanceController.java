package com.StudentService.Controller;

import com.StudentService.Entity.Attendance;
import com.StudentService.Service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/attendance")



public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // ✅ Get attendance by student
    @GetMapping("/{studentId}")
    public List<Attendance> getAttendance(@PathVariable Long studentId) {
        return attendanceService.getAttendanceByStudent(studentId);
    }

    // ✅ Mark attendance (quick)
    @PostMapping("/mark/{studentId}")
    public Attendance markAttendance(
            @PathVariable Long studentId,
            @RequestParam boolean present
    ) {
        return attendanceService.markAttendance(studentId, present);
    }

    // ✅ Create with full body
    @PostMapping
    public Attendance createAttendance(@RequestBody Attendance attendance) {
        return attendanceService.saveAttendance(attendance);
    }

    // ✅ Update
    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestParam boolean present
    ) {
        return attendanceService.updateAttendance(id, present);
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return "Deleted successfully";
    }
}