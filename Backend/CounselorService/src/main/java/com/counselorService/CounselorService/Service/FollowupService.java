package com.counselorService.CounselorService.Service;

import com.counselorService.CounselorService.Entity.Followup;
import com.counselorService.CounselorService.Repository.FollowupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowupService {

    private final FollowupRepository repo;

    public FollowupService(FollowupRepository repo) {
        this.repo = repo;
    }

    public List<Followup> getAll() {
        return repo.findAll();
    }

    public List<Followup> getByCounselor(Long counselorId) {
        return repo.findByCounselorId(counselorId);
    }

    // ✅ FIXED CREATE METHOD
    public Followup create(Followup followup) {

        // 🔥 VALIDATION (prevents 500 error)
        if (followup.getEnquiryId() == null) {
            throw new RuntimeException("Enquiry ID is required");
        }

        if (followup.getCounselorId() == null) {
            throw new RuntimeException("Counselor ID is required");
        }

        if (followup.getFollowupDate() == null) {
            throw new RuntimeException("Follow-up date is required");
        }

        if (followup.getStatus() == null || followup.getStatus().isEmpty()) {
            followup.setStatus("Pending"); // default
        }

        return repo.save(followup);
    }

    // ✅ UPDATE METHOD (SAFE)
    public Followup update(Long id, Followup updated) {

        Followup existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Followup not found: " + id));

        if (updated.getFollowupDate() != null) {
            existing.setFollowupDate(updated.getFollowupDate());
        }

        if (updated.getStatus() != null) {
            existing.setStatus(updated.getStatus());
        }

        if (updated.getRemarks() != null) {
            existing.setRemarks(updated.getRemarks());
        }

        return repo.save(existing);
    }
}

