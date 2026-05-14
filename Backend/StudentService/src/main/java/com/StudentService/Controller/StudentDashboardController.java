package com.StudentService.Controller;

import com.StudentService.dto.StudentDashboardDTO;
import com.StudentService.Service.StudentDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/dashboard")
public class StudentDashboardController {

    @Autowired
    private StudentDashboardService dashboardService;

    @GetMapping("/{userId}")
    public ResponseEntity<StudentDashboardDTO> getDashboard(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                dashboardService.getDashboard(userId)
        );
    }
}