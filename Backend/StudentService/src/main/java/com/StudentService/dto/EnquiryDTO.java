package com.StudentService.dto;


public class EnquiryDTO {

    private Long id;
    private Long userId;
    private String courseInterested;
    private String stage;
    private String status;
    private String studentName;

    // getters & setters


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

    public String getCourseInterested() {
        return courseInterested;
    }

    public void setCourseInterested(String courseInterested) {
        this.courseInterested = courseInterested;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}