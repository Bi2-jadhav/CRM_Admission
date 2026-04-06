package com.counselorService.CounselorService.Repository;

import com.counselorService.CounselorService.Entity.Followup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FollowupRepository extends JpaRepository<Followup, Long> {
    List<Followup> findByCounselorId(Long counselorId);
    List<Followup> findByEnquiryId(Long enquiryId);
}
