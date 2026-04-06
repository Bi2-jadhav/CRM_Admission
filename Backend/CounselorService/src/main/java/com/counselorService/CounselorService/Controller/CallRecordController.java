package com.counselorService.CounselorService.Controller;

import com.counselorService.CounselorService.Entity.CallRecord;
import com.counselorService.CounselorService.Service.CallRecordService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/counselor/calls")

public class CallRecordController {

    private final CallRecordService service;

    public CallRecordController(CallRecordService service) {
        this.service = service;
    }

    @GetMapping
    public List<CallRecord> getAll() {
        return service.getAll();
    }

    @GetMapping("/counselor/{counselorId}")
    public List<CallRecord> getByCounselor(@PathVariable Long counselorId) {
        return service.getByCounselor(counselorId);
    }

    @GetMapping("/enquiry/{enquiryId}")
    public List<CallRecord> getByEnquiry(@PathVariable Long enquiryId) {
        return service.getByEnquiry(enquiryId);
    }

    @PostMapping
    public CallRecord create(@RequestBody CallRecord record) {
        return service.create(record);
    }
}
