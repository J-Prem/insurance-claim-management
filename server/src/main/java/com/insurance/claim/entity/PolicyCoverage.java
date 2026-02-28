package com.insurance.claim.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "policy_coverage")
public class PolicyCoverage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String coverageName;

    private double coverageLimit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public String getCoverageName() {
        return coverageName;
    }

    public void setCoverageName(String coverageName) {
        this.coverageName = coverageName;
    }

    public double getCoverageLimit() {
        return coverageLimit;
    }

    public void setCoverageLimit(double coverageLimit) {
        this.coverageLimit = coverageLimit;
    }

    public Policy getPolicy() {
        return policy;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }
}
