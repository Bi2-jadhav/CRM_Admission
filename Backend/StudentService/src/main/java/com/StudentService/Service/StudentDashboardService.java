package com.StudentService.Service;

import com.StudentService.Clients.AdmissionClient;
import com.StudentService.Clients.EnquiryClient;
import com.StudentService.Clients.TrainerClient;
import com.StudentService.dto.AdmissionDTO;
import com.StudentService.dto.AttendanceDTO;
import com.StudentService.dto.EnquiryDTO;
import com.StudentService.dto.StudentDashboardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentDashboardService {

    @Autowired
    private AdmissionClient admissionClient;

    @Autowired
    private TrainerClient trainerClient;

    @Autowired
    private EnquiryClient enquiryClient;

    public StudentDashboardDTO getDashboard(Long userId) {

        StudentDashboardDTO dto = new StudentDashboardDTO();

        // 🔹 Admission
        try {
            AdmissionDTO admission = admissionClient.getAdmissionByUserId(userId);

            if (admission != null) {
                dto.setName(admission.getStudentName());
                dto.setCourse(admission.getCourse());
                dto.setTotalFees(admission.getTotalFees());
                dto.setPaidFees(admission.getPaidFees());
                dto.setPendingFees(
                        admission.getTotalFees() - admission.getPaidFees()
                );
            }

        } catch (Exception e) {
            System.out.println("❌ Admission Error: " + e.getMessage());
        }

        // 🔹 Attendance
        try {
            AttendanceDTO attendance = trainerClient.getAttendance(userId);

            if (attendance != null) {
                dto.setAttendancePercentage(attendance.getPercentage());
                dto.setTrainerName(attendance.getTrainerName());
            }

        } catch (Exception e) {
            System.out.println("❌ Attendance Error: " + e.getMessage());
        }

        // 🔹 Enquiry
        try {
            EnquiryDTO enquiry = enquiryClient.getEnquiry(userId);

            if (enquiry != null) {
                dto.setEnquiryStatus(enquiry.getStatus());
            }

        } catch (Exception e) {
            System.out.println("❌ Enquiry Error: " + e.getMessage());
        }

        return dto;
    }
}
