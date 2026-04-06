package com.adminService.AdminService.Repository;

import com.adminService.AdminService.Entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByAssignedCounselorId(Long counselorId);
    long countByStage(String stage);
}
