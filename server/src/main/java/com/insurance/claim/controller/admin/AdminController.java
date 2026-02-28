package com.insurance.claim.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.insurance.claim.dto.admin.AdminClaimResponseDTO;
import com.insurance.claim.dto.admin.AssignSurveyorDTO;
import com.insurance.claim.dto.admin.AssignSurveyorResponseDTO;
import com.insurance.claim.dto.admin.CreatePolicyCoverageDTO;
import com.insurance.claim.dto.admin.CreatePolicyDTO;
import com.insurance.claim.entity.Policy;
import com.insurance.claim.entity.PolicyCoverage;
import com.insurance.claim.service.admin.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/policy")
    public Policy createPolicy(@RequestBody CreatePolicyDTO dto) {
        return adminService.createPolicy(dto);
    }

    @GetMapping("/claims")
    public List<AdminClaimResponseDTO> getAllClaims() {
        return adminService.getAllClaims();
    }

    @PutMapping("/assign-surveyor")
    public AssignSurveyorResponseDTO assignSurveyor(@RequestBody AssignSurveyorDTO dto) {
        return adminService.assignSurveyor(dto);
    }

    @PostMapping("/policy/coverage")
    public PolicyCoverage addCoverage(
            @RequestBody CreatePolicyCoverageDTO dto) {
        return adminService.addPolicyCoverage(dto);
    }

    @GetMapping("/surveyors/available")
    public List<com.insurance.claim.entity.Users> getAvailableSurveyors() {
        return adminService.getAvailableSurveyors();
    }

    @GetMapping("/policy/applications")
    public List<com.insurance.claim.entity.CustomerPolicy> getPendingPolicyApplications() {
        return adminService.getPendingPolicyApplications();
    }

    @PutMapping("/policy/applications/{id}/approve")
    public com.insurance.claim.entity.CustomerPolicy approvePolicyApplication(@PathVariable Long id) {
        return adminService.approvePolicyApplication(id);
    }

}
