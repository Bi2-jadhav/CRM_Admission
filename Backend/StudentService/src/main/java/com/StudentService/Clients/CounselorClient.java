package com.StudentService.Clients;

import com.StudentService.dto.CallRecordDTO;
import com.StudentService.dto.FollowupDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
@FeignClient(
        name = "COUNSELOR-SERVICE",
        contextId = "counselorClient"
)
public interface CounselorClient {

    @PostMapping("/api/counselor/calls/by-enquiry-ids")
    List<CallRecordDTO> getCalls(@RequestBody List<Long> enquiryIds);

    @PostMapping("/api/counselor/followups/by-enquiry-ids")
    List<FollowupDTO> getFollowups(@RequestBody List<Long> enquiryIds);
}