package com.StudentService.dto;




public class AttendanceDTO {
    private Double percentage;
    private String trainerName;

    // getters & setters


    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getTrainerName() {
        return trainerName;
    }

    public void setTrainerName(String trainerName) {
        this.trainerName = trainerName;
    }
}