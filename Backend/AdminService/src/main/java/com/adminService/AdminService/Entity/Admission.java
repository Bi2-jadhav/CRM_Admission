package com.adminService.AdminService.Entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Admission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ✅ Admission ID
    private Long enquiryId;     // ✅ Enquiry ID

    private Long userId;

    private Long trainerId;
    private String studentName;
    private String phone;
    private String email;
    private String address;
    private String courseSelected;
    private Double fees;
    private Double feesPaid;
    private String paymentStatus; // Paid / Partial / Pending
    private String paymentType;   // Cash / UPI / Online
    private Integer installment;
    private LocalDate admissionDate;

    // ================= GETTERS & SETTERS =================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }

    public Long getEnquiryId() { return enquiryId; }
    public void setEnquiryId(Long enquiryId) { this.enquiryId = enquiryId; }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCourseSelected() { return courseSelected; }
    public void setCourseSelected(String courseSelected) { this.courseSelected = courseSelected; }

    public Double getFees() { return fees; }
    public void setFees(Double fees) { this.fees = fees; }

    public Double getFeesPaid() { return feesPaid; }
    public void setFeesPaid(Double feesPaid) { this.feesPaid = feesPaid; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Integer getInstallment() { return installment; }
    public void setInstallment(Integer installment) { this.installment = installment; }

    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate admissionDate) { this.admissionDate = admissionDate; }
}