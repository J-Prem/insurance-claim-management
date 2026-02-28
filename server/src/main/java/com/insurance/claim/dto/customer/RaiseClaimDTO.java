package com.insurance.claim.dto.customer;

public class RaiseClaimDTO {

    private Long customerPolicyId;
    private String reason;
    private double claimAmount;

    public RaiseClaimDTO() {}

    public Long getCustomerPolicyId() {
        return customerPolicyId;
    }

    public void setCustomerPolicyId(Long customerPolicyId) {
        this.customerPolicyId = customerPolicyId;
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
}
