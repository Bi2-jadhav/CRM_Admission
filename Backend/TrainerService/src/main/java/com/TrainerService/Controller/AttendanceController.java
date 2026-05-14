package com.TrainerService.Controller;


import com.TrainerService.Entity.Attendance;
import com.TrainerService.Service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer/attendance")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    // ✅ Mark attendance
    @PostMapping
    public Attendance mark(@RequestBody Attendance attendance) {

        System.out.println("DEBUG: Mark attendance request received.");
        System.out.println("UserID: " + attendance.getUserId());
        System.out.println("TrainerID: " + attendance.getTrainerId());
        System.out.println("Date: " + attendance.getDate());
        System.out.println("Status: " + attendance.getStatus());

        return service.markAttendance(attendance);
    }

    // ✅ Get attendance list
    @GetMapping("/user/{userId}")
    public List<Attendance> getByUser(@PathVariable Long userId) {
        return service.getByUser(userId);
    }

    // ✅ Get percentage (for student dashboard)
    @GetMapping("/percentage/{userId}")
    public double getPercentage(@PathVariable Long userId) {
        return service.getAttendancePercentage(userId);
    }
}