package com.counselorService.CounselorService.Repository;

import com.counselorService.CounselorService.Entity.CallRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CallRecordRepository extends JpaRepository<CallRecord, Long> {
    List<CallRecord> findByCounselorId(Long counselorId);
    List<CallRecord> findByEnquiryId(Long enquiryId);
}
