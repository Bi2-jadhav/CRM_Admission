package com.StudentService.Clients;

import com.StudentService.dto.AdmissionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ADMIN-SERVICE", url = "http://localhost:8082")
public interface AdmissionClient {

    @GetMapping("/api/admin/admissions/user/{userId}") // ✅ FIXED
    AdmissionDTO getAdmissionByUserId(@PathVariable Long userId);
}