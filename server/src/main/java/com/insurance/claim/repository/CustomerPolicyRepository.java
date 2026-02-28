package com.insurance.claim.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.insurance.claim.entity.CustomerPolicy;

@Repository
public interface CustomerPolicyRepository
                extends JpaRepository<CustomerPolicy, Long> {

        // 🔹 Find ACTIVE policy of a customer
        Optional<CustomerPolicy> findByCustomerIdAndStatus(
                        Long customerId,
                        String status);

        // 🔹 Check if customer already has a specific policy
        boolean existsByCustomerIdAndPolicyId(Long customerId, Long policyId);

        // 🔹 Find all policies by status (for expiration task)
        List<CustomerPolicy> findAllByStatus(String status);

        java.util.List<CustomerPolicy> findByStatus(String status);

        java.util.List<CustomerPolicy> findByCustomerId(Long customerId);

        // 🔹 Helper method (ACTIVE policy only)
        default Optional<CustomerPolicy> findActivePolicyByCustomerId(
                        Long customerId) {
                return findByCustomerIdAndStatus(customerId, "ACTIVE");
        }
}
