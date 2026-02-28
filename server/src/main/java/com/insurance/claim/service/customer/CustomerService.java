package com.insurance.claim.service.customer;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurance.claim.dto.customer.ApplyPolicyDTO;
import com.insurance.claim.dto.customer.ClaimResponseDTO;
import com.insurance.claim.dto.customer.RaiseClaimDTO;
import com.insurance.claim.entity.*;
import com.insurance.claim.enums.ClaimStatus;
import com.insurance.claim.exception.ResourceNotFoundException;
import com.insurance.claim.exception.UnauthorizedException;
import com.insurance.claim.repository.*;
import com.insurance.claim.security.SecurityUtil;

@Service
public class CustomerService {

    @Autowired
    private PolicyRepository policyRepo;

    @Autowired
    private CustomerPolicyRepository customerPolicyRepo;

    @Autowired
    private ClaimRepository claimRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PolicyCoverageRepository coverageRepo;

    // ✅ View active policies
    public List<Policy> getActivePolicies() {
        return policyRepo.findByActiveTrue();
    }

    // ✅ Apply for policy
    public CustomerPolicy applyPolicy(ApplyPolicyDTO dto) {

        Long customerId = SecurityUtil.getCurrentUserId();

        Users customer = userRepo.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Policy policy = policyRepo.findById(dto.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        // 🛡️ Ensure policy is active
        if (!policy.isActive()) {
            throw new RuntimeException("This policy is currently inactive and cannot be applied for.");
        }

        // 🛡️ BUSINESS RULE: Restriction on new policy application if there's an active
        // claim
        List<ClaimStatus> activeStatuses = List.of(
                ClaimStatus.PENDING,
                ClaimStatus.ASSIGNED,
                ClaimStatus.APPROVED,
                ClaimStatus.FINALIZED);
        long activeClaimsCount = claimRepo.countByCustomerPolicyCustomerIdAndStatusIn(customerId, activeStatuses);

        if (activeClaimsCount > 0) {
            throw new RuntimeException("You cannot apply for a new policy while a claim or application is active.");
        }

        // 🛡️ BUSINESS RULE: Check for any PENDING policy application
        boolean hasPendingApp = customerPolicyRepo.findByCustomerIdAndStatus(customerId, "PENDING").isPresent();
        if (hasPendingApp) {
            throw new RuntimeException("You cannot apply for a new policy while a claim or application is active.");
        }

        CustomerPolicy cp = new CustomerPolicy();
        cp.setCustomer(customer);
        cp.setPolicy(policy);
        cp.setStartDate(LocalDate.now());
        cp.setEndDate(LocalDate.now().plusYears(1));
        cp.setStatus("PENDING");

        return customerPolicyRepo.save(cp);
    }

    // ✅ Raise claim
    public ClaimResponseDTO raiseClaim(RaiseClaimDTO dto) {

        Long customerId = SecurityUtil.getCurrentUserId();

        CustomerPolicy cp = customerPolicyRepo.findById(dto.getCustomerPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy record not found"));

        // 🛡️ Ownership check
        if (!cp.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("Ownership Error: You do not own this policy.");
        }

        // 🛡️ Status check
        if (!"ACTIVE".equalsIgnoreCase(cp.getStatus())) {
            throw new RuntimeException(
                    "Denied: Claims can only be raised for ACTIVE policies. Current status: " + cp.getStatus());
        }

        // 🛡️ Date check
        if (cp.getEndDate().isBefore(LocalDate.now())) {
            cp.setStatus("EXPIRED");
            customerPolicyRepo.save(cp);
            throw new RuntimeException("Denied: This policy has expired.");
        }

        // 🛡️ Duplicate claim check
        if (claimRepo.existsByCustomerPolicyId(cp.getId())) {
            throw new RuntimeException("Denied: A claim has already been raised for this policy.");
        }

        // 🛡️ Amount validation
        if (dto.getClaimAmount() <= 0) {
            throw new RuntimeException("Validation Error: Claim amount must be greater than zero.");
        }

        double maxCoverage = cp.getPolicy().getCoverageAmount();
        if (dto.getClaimAmount() > maxCoverage) {
            throw new RuntimeException(
                    "Denied: Claim amount " + dto.getClaimAmount() + " exceeds total coverage limit of " + maxCoverage);
        }

        Claim claim = new Claim();
        claim.setCustomerPolicy(cp);
        claim.setReason(dto.getReason());
        claim.setClaimAmount(dto.getClaimAmount());
        claim.setStatus(ClaimStatus.PENDING);

        Claim saved = claimRepo.save(claim);

        // 🔥 MAP TO DTO
        ClaimResponseDTO response = new ClaimResponseDTO();
        response.setId(saved.getId());
        response.setReason(saved.getReason());
        response.setClaimAmount(saved.getClaimAmount());
        response.setStatus(saved.getStatus());
        response.setPolicyName(cp.getPolicy().getPolicyName());
        response.setPolicyStart(cp.getStartDate());
        response.setPolicyEnd(cp.getEndDate());

        return response;
    }

    // ✅ Get my claims (DTO-based — FIXED)
    public List<ClaimResponseDTO> getMyClaims() {

        Long customerId = SecurityUtil.getCurrentUserId();

        List<Claim> claims = claimRepo.findByCustomerPolicyCustomerId(customerId);

        return claims.stream().map(claim -> {
            ClaimResponseDTO dto = new ClaimResponseDTO();

            dto.setId(claim.getId());
            dto.setReason(claim.getReason());
            dto.setClaimAmount(claim.getClaimAmount());
            dto.setStatus(claim.getStatus());

            dto.setPolicyName(
                    claim.getCustomerPolicy().getPolicy().getPolicyName());
            dto.setPolicyStart(
                    claim.getCustomerPolicy().getStartDate());
            dto.setPolicyEnd(
                    claim.getCustomerPolicy().getEndDate());

            return dto;
        }).toList();
    }

    public List<PolicyCoverage> getMyPolicyCoverage() {

        Long customerId = SecurityUtil.getCurrentUserId();

        // 1️⃣ Fetch ACTIVE policy of logged-in customer
        CustomerPolicy cp = customerPolicyRepo
                .findActivePolicyByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No active policy found for customer"));

        // 2️⃣ Fetch coverage using policyId
        return coverageRepo.findByPolicyId(
                cp.getPolicy().getId());
    }

    public List<CustomerPolicy> getMyPolicies() {
        return customerPolicyRepo.findByCustomerId(SecurityUtil.getCurrentUserId());
    }
}
