package com.authService.authService.Dto;

import lombok.Data;

@Data
public class TrainerDTO {
    private Long userId;
    private String name;
    private String email;
    private String speciality;
    private int experience;
}
