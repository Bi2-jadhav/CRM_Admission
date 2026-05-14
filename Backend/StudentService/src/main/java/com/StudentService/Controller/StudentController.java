package com.StudentService.Controller;

import com.StudentService.Entity.Student;
import com.StudentService.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public Student create(@RequestBody Student student) {
        return studentService.save(student);
    }

    @GetMapping
    public List<Student> getAll() {
        return studentService.getAll();
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id) {
        return studentService.getById(id);
    }

    @GetMapping("/user/{userId}")
    public Student getByUserId(@PathVariable Long userId) {
        return studentService.getByUserId(userId);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student updated) {
        return studentService.updateStudent(id, updated);
    }

    @PutMapping("/user/{userId}")
    public Student updateByUserId(@PathVariable Long userId, @RequestBody Student student) {
        return studentService.updateByUserId(userId, student);
    }
}