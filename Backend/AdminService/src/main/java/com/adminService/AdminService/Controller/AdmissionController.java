package com.adminService.AdminService.Controller;


import com.adminService.AdminService.Entity.Admission;
import com.adminService.AdminService.Service.AdmissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/admissions")
public class AdmissionController {

    private final AdmissionService service;

    public AdmissionController(AdmissionService service) {
        this.service = service;
    }

    // ✅ CREATE ADMISSION
    @PostMapping
    public Admission create(@RequestBody Admission admission) {
        return service.create(admission);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Admission> getAll() {
        return service.getAll();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Admission getById(@PathVariable Long id) {
        return service.getById(id);
    }
}