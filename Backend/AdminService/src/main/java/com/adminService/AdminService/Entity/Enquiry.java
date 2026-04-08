package com.adminService.AdminService.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id


    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String phone;
    private String email;
    private String courseInterested;
    private String source;
    private String stage;
    private Long assignedCounselorId;
    private String status;
    private LocalDate createdDate;

    public Enquiry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCourseInterested() { return courseInterested; }
    public void setCourseInterested(String courseInterested) { this.courseInterested = courseInterested; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Long getAssignedCounselorId() { return assignedCounselorId; }
    public void setAssignedCounselorId(Long assignedCounselorId) { this.assignedCounselorId = assignedCounselorId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
}
