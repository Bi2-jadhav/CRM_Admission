package com.adminService.AdminService.Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "STUDENT-SERVICE", url = "http://localhost:8084")
public interface StudentClient {

    @PutMapping("/api/student/user/{userId}")
    Object updateByUserId(@PathVariable Long userId, @RequestBody Object student);
}
