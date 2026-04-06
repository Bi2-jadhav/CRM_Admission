package com.adminService.AdminService.Service;

import com.adminService.AdminService.Entity.Course;
import com.adminService.AdminService.Repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public List<Course> getAll() {
        return repo.findAll();
    }

    public Course create(Course course) {
        if (course.getCreatedDate() == null) {
            course.setCreatedDate(LocalDate.now());
        }
        return repo.save(course);
    }

    public Course update(Long id, Course updated) {
        Course existing = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        existing.setName(updated.getName());
        existing.setSpecialization(updated.getSpecialization());
        existing.setDuration(updated.getDuration());
        existing.setMode(updated.getMode());
        existing.setStatus(updated.getStatus());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
