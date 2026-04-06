package com.counselorService.CounselorService.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "followups")
public class Followup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long enquiryId;
    private Long counselorId;
    private LocalDate followupDate;
    private String status;  // Pending, Completed, Cancelled

    @Column(length = 1000)
    private String remarks;

    public Followup() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEnquiryId() { return enquiryId; }
    public void setEnquiryId(Long enquiryId) { this.enquiryId = enquiryId; }

    public Long getCounselorId() { return counselorId; }
    public void setCounselorId(Long counselorId) { this.counselorId = counselorId; }

    public LocalDate getFollowupDate() { return followupDate; }
    public void setFollowupDate(LocalDate followupDate) { this.followupDate = followupDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
