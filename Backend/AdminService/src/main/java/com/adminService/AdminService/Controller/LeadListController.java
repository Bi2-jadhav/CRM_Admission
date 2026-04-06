package com.adminService.AdminService.Controller;

import com.adminService.AdminService.Entity.LeadList;
import com.adminService.AdminService.Service.LeadListService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/lists")

public class LeadListController {

    private final LeadListService service;

    public LeadListController(LeadListService service) {
        this.service = service;
    }

    @GetMapping
    public List<LeadList> getAll() {
        return service.getAll();
    }

    @PostMapping
    public LeadList create(@RequestBody LeadList list) {
        return service.create(list);
    }

    @PutMapping("/{id}")
    public LeadList update(@PathVariable Long id, @RequestBody LeadList list) {
        return service.update(id, list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
