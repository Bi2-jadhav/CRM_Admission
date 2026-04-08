package com.adminService.AdminService.Service;

import com.adminService.AdminService.Entity.Admission;
import com.adminService.AdminService.Entity.Enquiry;
import com.adminService.AdminService.Repository.AdmissionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdmissionService {

    private final AdmissionRepository repo;
    private final EnquiryService enquiryService;

    public AdmissionService(AdmissionRepository repo, EnquiryService enquiryService) {
        this.repo = repo;
        this.enquiryService = enquiryService;
    }

    // ✅ CONVERT ENQUIRY → ADMISSION
    public Admission create(Admission admission) {

        // 1️⃣ Get enquiry
        Enquiry enquiry = enquiryService.getById(admission.getEnquiryId());

        // 2️⃣ Auto fill fields
        if (admission.getStudentName() == null) {
            admission.setStudentName(enquiry.getStudentName());
        }

        if (admission.getCourseSelected() == null) {
            admission.setCourseSelected(enquiry.getCourseInterested());
        }

        if (admission.getAdmissionDate() == null) {
            admission.setAdmissionDate(LocalDate.now());
        }

        // 3️⃣ Payment logic
        if (admission.getFeesPaid() == null) {
            admission.setFeesPaid(0.0);
        }

        if (admission.getFees() != null) {
            if (admission.getFeesPaid() >= admission.getFees()) {
                admission.setPaymentStatus("Paid");
            } else if (admission.getFeesPaid() > 0) {
                admission.setPaymentStatus("Partial");
            } else {
                admission.setPaymentStatus("Pending");
            }
        }

        // 🔥 4️⃣ UPDATE ENQUIRY → Converted (FIXED)
        enquiry.setStage("Converted");
        enquiryService.update(enquiry.getId(), enquiry);

        // 5️⃣ Save admission
        return repo.save(admission);
    }

    public List<Admission> getAll() {
        return repo.findAll();
    }

    public Admission getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }
}