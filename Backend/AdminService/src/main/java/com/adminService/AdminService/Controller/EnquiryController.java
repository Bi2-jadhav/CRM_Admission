package com.adminService.AdminService.Controller;

import com.adminService.AdminService.Entity.Enquiry;
import com.adminService.AdminService.Service.EnquiryService;
import com.adminService.AdminService.Service.ExcelService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/enquiries")
public class EnquiryController {

    private final EnquiryService service;
    private final ExcelService excelService;

    public EnquiryController(EnquiryService service, ExcelService excelService) {
        this.service = service;
        this.excelService = excelService;
    }

    // ================= GET ALL =================
    @GetMapping
    public List<Enquiry> getAll() {
        return service.getAll();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public Enquiry getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ================= GET BY COUNSELOR =================
    @GetMapping("/counselor/{counselorId}")
    public List<Enquiry> getByCounselor(@PathVariable Long counselorId) {
        return service.getByCounselor(counselorId);
    }

    // ================= CREATE =================
    @PostMapping
    public Enquiry create(@RequestBody Enquiry enquiry) {
        return service.create(enquiry);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public Enquiry update(@PathVariable Long id, @RequestBody Enquiry enquiry) {
        return service.update(id, enquiry);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ================= EXCEL UPLOAD ================= 🔥
    @PostMapping("/upload")
    public ResponseEntity<?> uploadExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("counselorId") Long counselorId) {

        try {
            List<Enquiry> enquiries = excelService.parseExcel(file, counselorId);

            // 🔥 Save using service (keeps validation logic)
            enquiries.forEach(service::create);

            return ResponseEntity.ok(
                    enquiries.size() + " leads uploaded successfully ✅"
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error processing file ❌: " + e.getMessage());
        }
    }
}