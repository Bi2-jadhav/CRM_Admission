package com.StudentService.Service;

import com.StudentService.Entity.Student;
import com.StudentService.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public Student getById(Long id) {
        return studentRepository.findById(id).orElseThrow();
    }


    // if student exists return existing and if notthen creates one automatically
    public Student getByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long id, Student updated) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(updated.getName());
        student.setEmail(updated.getEmail());
        student.setPhone(updated.getPhone());
        student.setAddress(updated.getAddress());
        student.setCourse(updated.getCourse());
        student.setFeesPaid(updated.getFeesPaid());
        student.setDocuments(updated.getDocuments());
        student.setTrainerId(updated.getTrainerId());

        // 🔥 ADD THESE

        student.setStatus(updated.getStatus());

        return studentRepository.save(student);
    }

    // ✅ Create student (from admission)
    public Student createStudent(Student student) {
        student.setStatus("ACTIVE");
        return studentRepository.save(student);
    }

    // ✅ Update student by userId (for sync from AdminService)
    public Student updateByUserId(Long userId, Student updated) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found with userId: " + userId));

        if (updated.getName() != null) student.setName(updated.getName());
        if (updated.getEmail() != null) student.setEmail(updated.getEmail());
        if (updated.getPhone() != null) student.setPhone(updated.getPhone());
        if (updated.getAddress() != null) student.setAddress(updated.getAddress());
        if (updated.getCourse() != null) student.setCourse(updated.getCourse());
        if (updated.getFeesPaid() != null) student.setFeesPaid(updated.getFeesPaid());
        if (updated.getTrainerId() != null) student.setTrainerId(updated.getTrainerId());
        if (updated.getStatus() != null) student.setStatus(updated.getStatus());

        Student saved = studentRepository.save(student);
        System.out.println("✅ Student updated sync. UserID: " + userId + ", TrainerID: " + saved.getTrainerId());
        return saved;
    }
}