package com.adminService.AdminService.Service;

import com.adminService.AdminService.Entity.LeadList;
import com.adminService.AdminService.Repository.LeadListRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class LeadListService {

    private final LeadListRepository repo;

    public LeadListService(LeadListRepository repo) {
        this.repo = repo;
    }

    public List<LeadList> getAll() {
        return repo.findAll();
    }

    public LeadList create(LeadList list) {
        if (list.getCreatedDate() == null) {
            list.setCreatedDate(LocalDate.now());
        }
        return repo.save(list);
    }

    public LeadList update(Long id, LeadList updated) {
        LeadList existing = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("List not found: " + id));
        existing.setName(updated.getName());
        existing.setSource(updated.getSource());
        existing.setCount(updated.getCount());
        existing.setStatus(updated.getStatus());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
