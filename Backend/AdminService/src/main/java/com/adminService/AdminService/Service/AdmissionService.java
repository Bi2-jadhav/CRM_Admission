package com.adminService.AdminService.Service;

import com.adminService.AdminService.Entity.Admission;
import com.adminService.AdminService.Entity.Course;
import com.adminService.AdminService.Entity.Enquiry;
import com.adminService.AdminService.Repository.AdmissionRepository;
import com.adminService.AdminService.Repository.CourseRepository;
import com.adminService.AdminService.Clients.StudentClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdmissionService {

    private final AdmissionRepository repo;
    private final EnquiryService enquiryService;
    private final CourseRepository courseRepo;
    private final StudentClient studentClient;

    public AdmissionService(AdmissionRepository repo, EnquiryService enquiryService, CourseRepository courseRepo, StudentClient studentClient) {
        this.repo = repo;
        this.enquiryService = enquiryService;
        this.courseRepo = courseRepo;
        this.studentClient = studentClient;
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

        // 3️⃣ Auto-fetch fees from Course if not provided
        if (admission.getFees() == null || admission.getFees() <= 0) {
            courseRepo.findByName(admission.getCourseSelected()).ifPresent(c -> {
                admission.setFees(c.getFees());
            });
        }

        // 4️⃣ Payment logic (Auto-recalculate status)
        if (admission.getFeesPaid() == null) {
            admission.setFeesPaid(0.0);
        }

        if (admission.getFees() != null && admission.getFees() > 0) {
            double total = admission.getFees();
            double paid = admission.getFeesPaid();

            if (paid >= total) {
                admission.setPaymentStatus("Paid");
            } else if (paid > 0) {
                admission.setPaymentStatus("Partial");
            } else {
                admission.setPaymentStatus("Pending");
            }
        }

        // 🔥 4️⃣ UPDATE ENQUIRY → Converted (FIXED)
        enquiry.setStage("Converted");
        enquiryService.update(enquiry.getId(), enquiry);

        // 5️⃣ Save admission
        Admission saved = repo.save(admission);

        // 6️⃣ Sync to Student Service
        syncToStudentService(saved);

        return saved;
    }

    public List<Admission> getAll() {
        return repo.findAll();
    }

    public Admission getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    public Admission getByUserId(Long userId) {
        return repo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    public List<Admission> getByTrainerId(Long trainerId) {
        return repo.findByTrainerId(trainerId);
    }

    public Admission update(Long id, Admission updated) {
        Admission admission = getById(id);
        admission.setTrainerId(updated.getTrainerId());
        admission.setStudentName(updated.getStudentName());
        admission.setPhone(updated.getPhone());
        admission.setEmail(updated.getEmail());
        admission.setAddress(updated.getAddress());
        admission.setFees(updated.getFees());
        admission.setFeesPaid(updated.getFeesPaid());
        
        // 🔥 Auto Recalculate Status
        if (admission.getFees() != null && admission.getFees() > 0) {
            double total = admission.getFees();
            double paid = admission.getFeesPaid() != null ? admission.getFeesPaid() : 0;

            if (paid >= total) admission.setPaymentStatus("Paid");
            else if (paid > 0) admission.setPaymentStatus("Partial");
            else admission.setPaymentStatus("Pending");
        }

        admission.setPaymentType(updated.getPaymentType());
        admission.setInstallment(updated.getInstallment());
        
        Admission saved = repo.save(admission);

        // 🔥 Sync to Student Service
        syncToStudentService(saved);

        return saved;
    }

    // ✅ HELPER: Sync Trainer assignment to StudentService
    private void syncToStudentService(Admission admission) {
        if (admission.getUserId() == null) {
            System.err.println("⚠️ Cannot sync to Student Service: UserId is NULL");
            return;
        }

        try {
            Map<String, Object> studentUpdate = new HashMap<>();
            studentUpdate.put("trainerId", admission.getTrainerId());
            studentUpdate.put("course", admission.getCourseSelected());
            studentUpdate.put("feesPaid", admission.getFeesPaid());
            studentUpdate.put("name", admission.getStudentName());

            System.out.println("DEBUG: Syncing to StudentService. UserID: " + admission.getUserId() + 
                               ", TrainerID: " + admission.getTrainerId() + 
                               ", URL: http://localhost:8084/api/student/user/" + admission.getUserId());

            studentClient.updateByUserId(admission.getUserId(), studentUpdate);
            System.out.println("✅ Successfully synced trainer to Student Service");
        } catch (Exception e) {
            System.err.println("❌ Failed to sync to Student Service: " + e.getMessage());
            e.printStackTrace();
        }
    }
}