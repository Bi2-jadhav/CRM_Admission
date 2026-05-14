package com.StudentService.Clients;

import com.StudentService.dto.EnquiryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ENQUIRY-SERVICE", url = "http://localhost:8082") // Enquiry is part of Admin Service
public interface EnquiryClient {

    @GetMapping("/api/admin/enquiries/user/{userId}")
    EnquiryDTO getEnquiry(@PathVariable Long userId);
}