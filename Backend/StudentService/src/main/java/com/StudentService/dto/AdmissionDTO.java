package com.StudentService.dto;


public class AdmissionDTO {

    private Long id;
    private String studentName;
    private String course;
    private Double totalFees;
    private Double paidFees;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Double getTotalFees() { return totalFees; }
    public void setTotalFees(Double totalFees) { this.totalFees = totalFees; }

    public Double getPaidFees() { return paidFees; }
    public void setPaidFees(Double paidFees) { this.paidFees = paidFees; }
}
