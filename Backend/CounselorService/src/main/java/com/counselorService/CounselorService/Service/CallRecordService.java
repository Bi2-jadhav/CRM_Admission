package com.counselorService.CounselorService.Service;

import com.counselorService.CounselorService.Entity.CallRecord;
import com.counselorService.CounselorService.Repository.CallRecordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CallRecordService {

    private final CallRecordRepository repo;

    public CallRecordService(CallRecordRepository repo) {
        this.repo = repo;
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

    public CallRecord create(CallRecord record) {
        return repo.save(record);
    }
}
