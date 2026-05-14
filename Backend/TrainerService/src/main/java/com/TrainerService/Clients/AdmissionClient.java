package com.TrainerService.Clients;

import com.TrainerService.DTO.AdmissionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ADMIN-SERVICE", url = "http://localhost:8082")
public interface AdmissionClient {

    @GetMapping("/api/admin/admissions/trainer/{trainerId}")
    List<AdmissionDTO> getStudentsByTrainer(@PathVariable Long trainerId);
}
