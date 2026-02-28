package com.insurance.claim.entity;

import com.insurance.claim.enums.ClaimStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "claim")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reason;

    @Column(nullable = false)
    private double claimAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_policy_id", nullable = false)
    private CustomerPolicy customerPolicy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surveyor_id")
    private Users surveyor;

    private Double approvedAmount;

    private boolean fraudSuspected = false;

    private String fraudNotes;

    // ===== GETTERS & SETTERS =====

    public boolean isFraudSuspected() {
        return fraudSuspected;
    }

    public void setFraudSuspected(boolean fraudSuspected) {
        this.fraudSuspected = fraudSuspected;
    }

    public String getFraudNotes() {
        return fraudNotes;
    }

    public void setFraudNotes(String fraudNotes) {
        this.fraudNotes = fraudNotes;
    }

    public Double getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(Double approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public Long getId() {
        return id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public double getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(double claimAmount) {
        this.claimAmount = claimAmount;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public CustomerPolicy getCustomerPolicy() {
        return customerPolicy;
    }

    public void setCustomerPolicy(CustomerPolicy customerPolicy) {
        this.customerPolicy = customerPolicy;
    }

    public Users getSurveyor() {
        return surveyor;
    }

    public void setSurveyor(Users surveyor) {
        this.surveyor = surveyor;
    }
}
