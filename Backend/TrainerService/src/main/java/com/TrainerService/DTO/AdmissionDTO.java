package com.TrainerService.DTO;


public class AdmissionDTO {

    private Long id;
    private Long userId;
    private String studentName;
    private String courseSelected;
    private Double fees;
    private Double feesPaid;
    private Long trainerId;

    public AdmissionDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCourseSelected() {
        return courseSelected;
    }

    public void setCourseSelected(String courseSelected) {
        this.courseSelected = courseSelected;
    }

    public Double getFees() {
        return fees;
    }

    public void setFees(Double fees) {
        this.fees = fees;
    }

    public Double getFeesPaid() {
        return feesPaid;
    }

    public void setFeesPaid(Double feesPaid) {
        this.feesPaid = feesPaid;
    }

    public Long getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }
}