package com.insurance.claim.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.claim.entity.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    // Customer: view only active policies
    List<Policy> findByActiveTrue();
}
