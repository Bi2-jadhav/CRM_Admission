package com.adminService.AdminService.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "lead_lists")
public class LeadList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String source;
    private Integer count;
    private String status;
    private LocalDate createdDate;

    public LeadList() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
}
