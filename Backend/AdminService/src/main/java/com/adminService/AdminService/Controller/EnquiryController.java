package com.adminService.AdminService.Controller;

import com.adminService.AdminService.Entity.Enquiry;
import com.adminService.AdminService.Service.EnquiryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/enquiries")

public class EnquiryController {

    private final EnquiryService service;

    public EnquiryController(EnquiryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Enquiry> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Enquiry getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/counselor/{counselorId}")
    public List<Enquiry> getByCounselor(@PathVariable Long counselorId) {
        return service.getByCounselor(counselorId);
    }

    @PostMapping
    public Enquiry create(@RequestBody Enquiry enquiry) {
        return service.create(enquiry);
    }

    @PutMapping("/{id}")
    public Enquiry update(@PathVariable Long id, @RequestBody Enquiry enquiry) {
        return service.update(id, enquiry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
