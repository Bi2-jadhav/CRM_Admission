package com.TrainerService.Service;
import com.TrainerService.Entity.Trainer;
import com.TrainerService.Repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    // ✅ Create Trainer
    public Trainer createTrainer(Trainer trainer) {

        // Optional validation
        if (trainerRepository.findByEmail(trainer.getEmail()) != null) {
            throw new RuntimeException("Trainer already exists with this email");
        }

        return trainerRepository.save(trainer);
    }

    // ✅ Get All Trainers
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    // ✅ Get Trainer By ID
    public Trainer getTrainerById(Long id) {
        return trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + id));
    }

    // ✅ Update Trainer
    public Trainer updateTrainer(Long id, Trainer updatedTrainer) {

        Trainer trainer = getTrainerById(id);

        trainer.setName(updatedTrainer.getName());
        trainer.setEmail(updatedTrainer.getEmail());
        trainer.setSpeciality(updatedTrainer.getSpeciality());
        trainer.setExperience(updatedTrainer.getExperience());

        return trainerRepository.save(trainer);
    }

    // ✅ Delete Trainer
    public void deleteTrainer(Long id) {
        Trainer trainer = getTrainerById(id);
        trainerRepository.delete(trainer);
    }

    // 🔍 Filter by speciality
    public List<Trainer> getBySpeciality(String speciality) {
        return trainerRepository.findBySpeciality(speciality);
    }

    // 🔍 Filter by experience
    public List<Trainer> getExperiencedTrainers(int years) {
        return trainerRepository.findByExperienceGreaterThan(years);
    }
}