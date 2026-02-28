package com.insurance.claim.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.claim.entity.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    // Customer-specific claims
    List<Claim> findByCustomerPolicyCustomerId(Long customerId);

    // Surveyor-specific claims
    List<Claim> findBySurveyorId(Long surveyorId);

    // Check if claim exists for a customer policy
    boolean existsByCustomerPolicyId(Long customerPolicyId);

    long countByCustomerPolicyCustomerIdAndStatusIn(Long customerId,
            java.util.List<com.insurance.claim.enums.ClaimStatus> statuses);
}
