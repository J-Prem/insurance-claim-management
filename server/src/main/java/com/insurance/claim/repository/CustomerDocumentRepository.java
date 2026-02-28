package com.insurance.claim.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.claim.entity.CustomerDocument;

public interface CustomerDocumentRepository
        extends JpaRepository<CustomerDocument, Long> {

    Optional<CustomerDocument> findByCustomerIdAndDocumentType(
            Long customerId,
            String documentType
    );
}
