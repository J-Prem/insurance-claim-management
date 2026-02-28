package com.insurance.claim.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.claim.entity.PolicyCoverage;

public interface PolicyCoverageRepository extends JpaRepository<PolicyCoverage, Long> {

    List<PolicyCoverage> findByPolicyId(Long policyId);
}
