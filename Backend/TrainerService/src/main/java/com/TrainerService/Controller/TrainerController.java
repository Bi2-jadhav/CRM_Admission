package com.TrainerService.Controller;

import com.TrainerService.Entity.Trainer;
import com.TrainerService.Repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    @Autowired
    private TrainerRepository trainerRepository;

    @PostMapping
    public Trainer create(@RequestBody Trainer trainer) {
        Trainer existing = trainerRepository.findByUserId(trainer.getUserId());
        if (existing != null) {
            return existing; // Return existing instead of creating duplicate
        }
        return trainerRepository.save(trainer);
    }

    @GetMapping
    public List<Trainer> getAll() {
        return trainerRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public Trainer getByUserId(@PathVariable Long userId) {
        return trainerRepository.findByUserId(userId);
    }

    @PutMapping("/{id}")
    public Trainer update(@PathVariable Long id, @RequestBody Trainer updated) {
        Trainer trainer = trainerRepository.findById(id).orElseThrow();
        trainer.setName(updated.getName());
        trainer.setEmail(updated.getEmail());
        trainer.setSpeciality(updated.getSpeciality());
        trainer.setExperience(updated.getExperience());
        return trainerRepository.save(trainer);
    }
}