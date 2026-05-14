package com.StudentService.Clients;

import com.StudentService.dto.AttendanceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "TRAINER-SERVICE", url = "http://localhost:8085")
public interface TrainerClient {

    @GetMapping("/api/attendance/user/{userId}")
    AttendanceDTO getAttendance(@PathVariable Long userId);
}
