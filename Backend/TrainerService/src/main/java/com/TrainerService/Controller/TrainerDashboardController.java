package com.TrainerService.Controller;

import com.TrainerService.DTO.TrainerDashboardDTO;
import com.TrainerService.Service.TrainerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trainer/dashboard")
public class TrainerDashboardController {

    @Autowired
    private TrainerDashboardService service;

    @GetMapping("/{trainerId}")
    public List<TrainerDashboardDTO> getDashboard(
            @PathVariable Long trainerId) {

        return service.getDashboard(trainerId);
    }
}