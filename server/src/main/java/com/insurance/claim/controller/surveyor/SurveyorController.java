package com.insurance.claim.controller.surveyor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.insurance.claim.dto.surveyor.ClaimDecisionDTO;
import com.insurance.claim.dto.surveyor.SurveyorClaimResponseDTO;
import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.PolicyCoverage;
import com.insurance.claim.service.surveyor.SurveyorService;

@RestController
@RequestMapping("/api/surveyor")
public class SurveyorController {

    @Autowired
    private SurveyorService surveyorService;

    @GetMapping("/claims")
    public List<SurveyorClaimResponseDTO> getAssignedClaims() {
        return surveyorService.getAssignedClaims();
    }


    @PutMapping("/approve")
    public SurveyorClaimResponseDTO approve(@RequestBody ClaimDecisionDTO dto) {
        return surveyorService.approveClaim(dto);
    }

    @PutMapping("/reject")
    public SurveyorClaimResponseDTO reject(@RequestBody ClaimDecisionDTO dto) {
        return surveyorService.rejectClaim(dto);
    }
    
    @GetMapping("/policy/coverage")
    public List<PolicyCoverage> getCoverageForClaim(
            @RequestParam Long claimId
    ) {
        return surveyorService.getCoverageForAssignedClaim(claimId);
    }


}
