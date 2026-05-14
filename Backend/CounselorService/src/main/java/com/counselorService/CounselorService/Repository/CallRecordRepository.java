package com.counselorService.CounselorService.Repository;

import com.counselorService.CounselorService.Entity.CallRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CallRecordRepository extends JpaRepository<CallRecord, Long> {

    List<CallRecord> findByCounselorId(Long counselorId);
    List<CallRecord> findByEnquiryId(Long enquiryId);

    // ✅ ADD THIS
    @Query("SELECT c FROM CallRecord c WHERE c.enquiryId IN :enquiryIds")
    List<CallRecord> findByEnquiryIds(List<Long> enquiryIds);
}