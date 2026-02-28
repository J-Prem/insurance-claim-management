package com.insurance.claim.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.claim.entity.CustomerProfile;

public interface CustomerProfileRepository
        extends JpaRepository<CustomerProfile, Long> {

    Optional<CustomerProfile> findByUserId(Long userId);

    boolean existsByPhoneAndIdNot(String phone, Long id);
}
