package com.insurance.claim.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "customer_policy",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"customer_id", "policy_id"})
    }
)
public class CustomerPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Logged-in customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Users customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(nullable = false)
    private String status; // ACTIVE / EXPIRED

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public Users getCustomer() {
        return customer;
    }

    public void setCustomer(Users customer) {
        this.customer = customer;
    }

    public Policy getPolicy() {
        return policy;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
