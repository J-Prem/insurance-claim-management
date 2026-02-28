package com.insurance.claim.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.claim.entity.Users;
import com.insurance.claim.enums.RoleType;

public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);

    // Used by admin to fetch surveyors
    // Used by admin to fetch surveyors
    Optional<Users> findByIdAndRole(Long id, RoleType role);

    java.util.List<Users> findByRoleAndStatusAndAvailableTrue(RoleType role, String status);
}
