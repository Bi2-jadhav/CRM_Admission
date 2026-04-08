package com.counselorService.CounselorService.Service;

import com.counselorService.CounselorService.Entity.CallRecord;
import com.counselorService.CounselorService.Repository.CallRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class CallRecordService {

    private final CallRecordRepository repo;
    private final RestTemplate restTemplate;

    // 🔥 CHANGE: inject RestTemplate instead of EnquiryRepository
    public CallRecordService(CallRecordRepository repo,
                             RestTemplate restTemplate) {
        this.repo = repo;
        this.restTemplate = restTemplate;
    }

    public List<CallRecord> getAll() {
        return repo.findAll();
    }

    public List<CallRecord> getByCounselor(Long counselorId) {
        return repo.findByCounselorId(counselorId);
    }

    public List<CallRecord> getByEnquiry(Long enquiryId) {
        return repo.findByEnquiryId(enquiryId);
    }

    // ✅ FINAL FIXED METHOD
    public CallRecord create(CallRecord record) {

        // 1️⃣ Save call
        CallRecord saved = repo.save(record);

        try {
            // 2️⃣ CALL ADMIN SERVICE API
            String url = "http://localhost:8080/api/admin/enquiries/" + record.getEnquiryId();

            restTemplate.put(
                    url,
                    Map.of("stage", "Called") // 🔥 ONLY send status
            );

        } catch (Exception e) {
            System.out.println("⚠️ Failed to update enquiry status: " + e.getMessage());
        }

        return saved;
    }
}