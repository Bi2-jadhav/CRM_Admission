package com.counselorService.CounselorService.Controller;

import com.counselorService.CounselorService.Entity.Followup;
import com.counselorService.CounselorService.Service.FollowupService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/counselor/followups")

public class FollowupController {

    private final FollowupService service;

    public FollowupController(FollowupService service) {
        this.service = service;
    }

    @GetMapping
    public List<Followup> getAll() {
        return service.getAll();
    }

    @GetMapping("/counselor/{counselorId}")
    public List<Followup> getByCounselor(@PathVariable Long counselorId) {
        return service.getByCounselor(counselorId);
    }

    @PostMapping
    public Followup create(@RequestBody Followup followup) {
        return service.create(followup);
    }

    @PutMapping("/{id}")
    public Followup update(@PathVariable Long id, @RequestBody Followup followup) {
        return service.update(id, followup);
    }
}
