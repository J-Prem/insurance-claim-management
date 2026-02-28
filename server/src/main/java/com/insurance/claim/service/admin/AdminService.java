package com.insurance.claim.service.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurance.claim.dto.admin.AdminClaimResponseDTO;
import com.insurance.claim.dto.admin.AssignSurveyorDTO;
import com.insurance.claim.dto.admin.AssignSurveyorResponseDTO;
import com.insurance.claim.dto.admin.CreatePolicyCoverageDTO;
import com.insurance.claim.dto.admin.CreatePolicyDTO;
import com.insurance.claim.entity.*;
import com.insurance.claim.enums.ClaimStatus;
import com.insurance.claim.exception.ResourceNotFoundException;
import com.insurance.claim.exception.UnauthorizedException;
import com.insurance.claim.repository.*;
import com.insurance.claim.security.SecurityUtil;

@Service
public class AdminService {

    @Autowired
    private PolicyRepository policyRepo;
    @Autowired
    private ClaimRepository claimRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PolicyCoverageRepository coverageRepo;
    @Autowired
    private CustomerPolicyRepository customerPolicyRepo;

    public Policy createPolicy(CreatePolicyDTO dto) {

        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }

        if (dto.getPremiumAmount() <= 0 || dto.getCoverageAmount() <= 0) {
            throw new RuntimeException("Validation Error: Premium and Coverage amounts must be greater than zero.");
        }

        Policy policy = new Policy();
        policy.setPolicyName(dto.getPolicyName());
        policy.setDescription(dto.getDescription());
        policy.setPremiumAmount(dto.getPremiumAmount());
        policy.setCoverageAmount(dto.getCoverageAmount());
        policy.setActive(dto.isActive());

        return policyRepo.save(policy);
    }

    public List<AdminClaimResponseDTO> getAllClaims() {

        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }

        List<Claim> claims = claimRepo.findAll();

        return claims.stream().map(claim -> {
            AdminClaimResponseDTO dto = new AdminClaimResponseDTO();

            dto.setClaimId(claim.getId());
            dto.setReason(claim.getReason());
            dto.setClaimAmount(claim.getClaimAmount());
            dto.setStatus(claim.getStatus());

            dto.setCustomerUsername(
                    claim.getCustomerPolicy().getCustomer().getUsername());

            dto.setPolicyName(
                    claim.getCustomerPolicy().getPolicy().getPolicyName());

            dto.setPolicyStart(
                    claim.getCustomerPolicy().getStartDate());

            dto.setPolicyEnd(
                    claim.getCustomerPolicy().getEndDate());

            if (claim.getSurveyor() != null) {
                dto.setSurveyorUsername(
                        claim.getSurveyor().getUsername());
            }

            return dto;
        }).toList();
    }

    public AssignSurveyorResponseDTO assignSurveyor(AssignSurveyorDTO dto) {

        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }

        Claim claim = claimRepo.findById(dto.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getStatus() == ClaimStatus.ASSIGNED || claim.getStatus() == ClaimStatus.APPROVED
                || claim.getStatus() == ClaimStatus.REJECTED) {
            throw new IllegalStateException(
                    "Denied: Cannot re-assign a surveyor to a claim that is already assigned or finalized.");
        }

        Users surveyor = userRepo.findById(dto.getSurveyorId())
                .orElseThrow(() -> new ResourceNotFoundException("Surveyor not found"));

        if (!surveyor.getRole().name().equals("SURVEYOR")) {
            throw new UnauthorizedException("User is not a surveyor");
        }

        claim.setSurveyor(surveyor);
        claim.setStatus(ClaimStatus.ASSIGNED);

        Claim saved = claimRepo.save(claim);

        // ✅ MAP TO DTO
        AssignSurveyorResponseDTO response = new AssignSurveyorResponseDTO();
        response.setClaimId(saved.getId());
        response.setStatus(saved.getStatus());
        response.setSurveyorUsername(surveyor.getUsername());

        return response;
    }

    public PolicyCoverage addPolicyCoverage(CreatePolicyCoverageDTO dto) {
        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }
        Policy policy = policyRepo.findById(dto.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        if (dto.getCoverageLimit() <= 0) {
            throw new RuntimeException("Validation Error: Coverage limit must be greater than zero.");
        }
        PolicyCoverage coverage = new PolicyCoverage();
        coverage.setPolicy(policy);
        coverage.setCoverageName(dto.getCoverageName());
        coverage.setCoverageLimit(dto.getCoverageLimit());
        return coverageRepo.save(coverage);
    }

    public List<Users> getAvailableSurveyors() {
        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }
        return userRepo.findByRoleAndStatusAndAvailableTrue(com.insurance.claim.enums.RoleType.SURVEYOR, "ACTIVE");
    }

    public List<CustomerPolicy> getPendingPolicyApplications() {
        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }
        return customerPolicyRepo.findByStatus("PENDING");
    }

    public CustomerPolicy approvePolicyApplication(Long id) {
        if (!SecurityUtil.hasRole("ADMIN")) {
            throw new UnauthorizedException("Admin access required");
        }
        CustomerPolicy cp = customerPolicyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy application not found"));
        if (!"PENDING".equalsIgnoreCase(cp.getStatus())) {
            throw new RuntimeException("Only PENDING applications can be approved. Current status: " + cp.getStatus());
        }
        cp.setStatus("ACTIVE");
        return customerPolicyRepo.save(cp);
    }
}
