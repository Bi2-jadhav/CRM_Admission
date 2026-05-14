package com.StudentService.dto;
public class StudentDashboardDTO {

    private String name;
    private String email;

    // Admission
    private String course;
    private Double totalFees;
    private Double paidFees;
    private Double pendingFees;

    // Attendance
    private Double attendancePercentage;

    // Enquiry
    private String enquiryStatus;

    // Trainer
    private String trainerName;

    // getters & setters


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Double getTotalFees() {
        return totalFees;
    }

    public void setTotalFees(Double totalFees) {
        this.totalFees = totalFees;
    }

    public Double getPaidFees() {
        return paidFees;
    }

    public void setPaidFees(Double paidFees) {
        this.paidFees = paidFees;
    }

    public Double getPendingFees() {
        return pendingFees;
    }

    public void setPendingFees(Double pendingFees) {
        this.pendingFees = pendingFees;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public String getEnquiryStatus() {
        return enquiryStatus;
    }

    public void setEnquiryStatus(String enquiryStatus) {
        this.enquiryStatus = enquiryStatus;
    }

    public String getTrainerName() {
        return trainerName;
    }

    public void setTrainerName(String trainerName) {
        this.trainerName = trainerName;
    }
}
