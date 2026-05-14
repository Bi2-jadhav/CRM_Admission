package com.TrainerService.Service;

import com.TrainerService.Clients.AdmissionClient;
import com.TrainerService.DTO.AdmissionDTO;
import com.TrainerService.DTO.TrainerDashboardDTO;
import com.TrainerService.Entity.Attendance;
import com.TrainerService.Repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerDashboardService {

    @Autowired
    private AdmissionClient admissionClient;

    @Autowired
    private AttendanceRepository attendanceRepo;

    public List<TrainerDashboardDTO> getDashboard(Long trainerId) {

        List<AdmissionDTO> students =
                admissionClient.getStudentsByTrainer(trainerId);

        return students.stream().map(student -> {

            TrainerDashboardDTO dto = new TrainerDashboardDTO();

            dto.setStudentName(student.getStudentName());
            dto.setCourse(student.getCourseSelected());
            dto.setUserId(student.getUserId()); // 🔥 CRITICAL FIX

            if (student.getUserId() != null) {
                // ✅ FIXED: get attendance list
                List<Attendance> attendanceList =
                        attendanceRepo.findByUserId(student.getUserId());

                double percentage = calculatePercentage(attendanceList);
                dto.setAttendancePercentage(percentage);
            } else {
                System.err.println("⚠️ Warning: Student " + student.getStudentName() + " has null userId in Admission record.");
                dto.setAttendancePercentage(0.0);
            }

            return dto;

        }).toList();
    }

    // ✅ NEW METHOD (IMPORTANT)
    private double calculatePercentage(List<Attendance> list) {

        if (list == null || list.isEmpty()) return 0;

        long presentCount = list.stream()
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()))
                .count();

        return (presentCount * 100.0) / list.size();
    }
}