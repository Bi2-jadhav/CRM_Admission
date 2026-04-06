
        package com.adminService.AdminService.Service;

import com.adminService.AdminService.Entity.Enquiry;
import com.adminService.AdminService.Repository.EnquiryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnquiryService {

    private final EnquiryRepository repo;

    public EnquiryService(EnquiryRepository repo) {
        this.repo = repo;
    }

    public List<Enquiry> getAll() {
        return repo.findAll();
    }

    public Enquiry getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Enquiry not found: " + id));
    }

    public List<Enquiry> getByCounselor(Long counselorId) {
        return repo.findByAssignedCounselorId(counselorId);
    }

    // 🔥 FIXED CREATE METHOD
    public Enquiry create(Enquiry enquiry) {

        // ✅ IMPORTANT VALIDATION
        if (enquiry.getAssignedCounselorId() == null) {
            throw new RuntimeException("Counselor must be assigned");
        }

        if (enquiry.getCreatedDate() == null) {
            enquiry.setCreatedDate(LocalDate.now());
        }

        return repo.save(enquiry);
    }

    public Enquiry update(Long id, Enquiry updated) {
        Enquiry existing = getById(id);

        existing.setStudentName(updated.getStudentName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setCourseInterested(updated.getCourseInterested());
        existing.setSource(updated.getSource());
        existing.setStage(updated.getStage());

        // ✅ SAFE UPDATE
        if (updated.getAssignedCounselorId() != null) {
            existing.setAssignedCounselorId(updated.getAssignedCounselorId());
        }

        existing.setStatus(updated.getStatus());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

