package com.insurance.claim.service.surveyor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurance.claim.dto.surveyor.ClaimDecisionDTO;
import com.insurance.claim.dto.surveyor.SurveyorClaimResponseDTO;
import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.PolicyCoverage;
import com.insurance.claim.enums.ClaimStatus;
import com.insurance.claim.exception.ResourceNotFoundException;
import com.insurance.claim.exception.UnauthorizedException;
import com.insurance.claim.repository.ClaimRepository;
import com.insurance.claim.repository.PolicyCoverageRepository;
import com.insurance.claim.security.SecurityUtil;

@Service
public class SurveyorService {

    @Autowired
    private ClaimRepository claimRepo;

    @Autowired
    private PolicyCoverageRepository coverageRepo;

    @Autowired
    private com.insurance.claim.repository.CustomerPolicyRepository customerPolicyRepo;

    public List<SurveyorClaimResponseDTO> getAssignedClaims() {

        if (!SecurityUtil.hasRole("SURVEYOR")) {
            throw new UnauthorizedException("Surveyor access required");
        }

        Long surveyorId = SecurityUtil.getCurrentUserId();

        List<Claim> claims = claimRepo.findBySurveyorId(surveyorId);

        return claims.stream().map(claim -> {
            SurveyorClaimResponseDTO dto = new SurveyorClaimResponseDTO();

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

            return dto;
        }).toList();
    }

    public SurveyorClaimResponseDTO approveClaim(ClaimDecisionDTO dto) {

        Long surveyorId = SecurityUtil.getCurrentUserId();

        Claim claim = claimRepo.findById(dto.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getSurveyor() == null ||
                !claim.getSurveyor().getId().equals(surveyorId)) {
            throw new UnauthorizedException("Not assigned to you");
        }

        if (claim.getStatus() == ClaimStatus.APPROVED) {
            throw new IllegalStateException("Already approved");
        }

        if (claim.getStatus() == ClaimStatus.REJECTED) {
            throw new IllegalStateException("Rejected claim cannot be approved");
        }

        // 🛡️ BUSINESS RULE: approved amount ≤ coverage limit
        double maxCoverage = claim.getCustomerPolicy().getPolicy().getCoverageAmount();

        if (dto.getApprovedAmount() == null || dto.getApprovedAmount() <= 0) {
            throw new RuntimeException("Validation Error: Approved amount must be greater than zero.");
        }

        if (dto.getApprovedAmount() > maxCoverage) {
            throw new RuntimeException("Denied: Approved amount " + dto.getApprovedAmount()
                    + " exceeds policy coverage limit of " + maxCoverage);
        }

        claim.setStatus(ClaimStatus.APPROVED);
        claim.setApprovedAmount(dto.getApprovedAmount());
        claim.setFraudSuspected(dto.isFraudSuspected());
        claim.setFraudNotes(dto.getFraudNotes());

        // 🛡️ BUSINESS RULE: Policy status -> ENDED after claim settlement
        com.insurance.claim.entity.CustomerPolicy cp = claim.getCustomerPolicy();
        cp.setStatus("ENDED");
        customerPolicyRepo.save(cp);

        Claim saved = claimRepo.save(claim);

        return mapToResponse(saved);
    }

    public SurveyorClaimResponseDTO rejectClaim(ClaimDecisionDTO dto) {

        Long surveyorId = SecurityUtil.getCurrentUserId();

        Claim claim = claimRepo.findById(dto.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getSurveyor() == null ||
                !claim.getSurveyor().getId().equals(surveyorId)) {
            throw new UnauthorizedException("Not assigned to you");
        }

        if (claim.getStatus() == ClaimStatus.APPROVED) {
            throw new IllegalStateException("Approved claim cannot be rejected");
        }

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setFraudSuspected(dto.isFraudSuspected());
        claim.setFraudNotes(dto.getFraudNotes());

        Claim saved = claimRepo.save(claim);

        return mapToResponse(saved);
    }

    private SurveyorClaimResponseDTO mapToResponse(Claim claim) {

        SurveyorClaimResponseDTO dto = new SurveyorClaimResponseDTO();

        dto.setClaimId(claim.getId());
        dto.setReason(claim.getReason());
        dto.setClaimAmount(claim.getClaimAmount());
        dto.setStatus(claim.getStatus());
        dto.setApprovedAmount(claim.getApprovedAmount());
        dto.setFraudSuspected(claim.isFraudSuspected());
        dto.setFraudNotes(claim.getFraudNotes());

        dto.setCustomerUsername(
                claim.getCustomerPolicy().getCustomer().getUsername());

        dto.setPolicyName(
                claim.getCustomerPolicy().getPolicy().getPolicyName());

        dto.setPolicyStart(
                claim.getCustomerPolicy().getStartDate());

        dto.setPolicyEnd(
                claim.getCustomerPolicy().getEndDate());

        return dto;
    }

    public List<PolicyCoverage> getCoverageForAssignedClaim(Long claimId) {

        Long surveyorId = SecurityUtil.getCurrentUserId();

        Claim claim = claimRepo.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        if (claim.getSurveyor() == null ||
                !claim.getSurveyor().getId().equals(surveyorId)) {
            throw new UnauthorizedException("Not your claim");
        }

        Long policyId = claim.getCustomerPolicy().getPolicy().getId();

        return coverageRepo.findByPolicyId(policyId);
    }

}
