package com.insurance.claim.dto.surveyor;

import jakarta.validation.constraints.NotNull;

public class ClaimDecisionDTO {

    @NotNull
    private Long claimId;

    private Double approvedAmount;

    private String remarks; // optional (future use)

    private boolean fraudSuspected;
    private String fraudNotes;

    public ClaimDecisionDTO() {
    }

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

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Double getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(Double approvedAmount) {
        this.approvedAmount = approvedAmount;
    }
}
