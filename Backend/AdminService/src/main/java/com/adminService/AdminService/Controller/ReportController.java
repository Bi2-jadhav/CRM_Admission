package com.adminService.AdminService.Controller;

import com.adminService.AdminService.Repository.EnquiryRepository;
import com.adminService.AdminService.Repository.LeadListRepository;
import com.adminService.AdminService.Repository.CourseRepository;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")

public class ReportController {

    private final EnquiryRepository enquiryRepo;
    private final LeadListRepository listRepo;
    private final CourseRepository courseRepo;

    public ReportController(EnquiryRepository enquiryRepo,
                            LeadListRepository listRepo,
                            CourseRepository courseRepo) {
        this.enquiryRepo = enquiryRepo;
        this.listRepo = listRepo;
        this.courseRepo = courseRepo;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEnquiries", enquiryRepo.count());
        summary.put("totalLists", listRepo.count());
        summary.put("totalCourses", courseRepo.count());

        // Enquiries by stage
        Map<String, Long> byStage = new HashMap<>();
        String[] stages = {"New", "Called", "Follow-up", "Closed", "Converted"};
        for (String stage : stages) {
            byStage.put(stage, enquiryRepo.countByStage(stage));
        }
        summary.put("enquiriesByStage", byStage);

        return summary;
    }
}
