package com.insurance.claim.dto.customer;

import com.insurance.claim.enums.ClaimStatus;
import java.time.LocalDate;

public class ClaimResponseDTO {

    private Long id;
    private String reason;
    private double claimAmount;
    private ClaimStatus status;

    private String policyName;
    private LocalDate policyStart;
    private LocalDate policyEnd;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public String getPolicyName() {
		return policyName;
	}
	public void setPolicyName(String policyName) {
		this.policyName = policyName;
	}
	public LocalDate getPolicyStart() {
		return policyStart;
	}
	public void setPolicyStart(LocalDate policyStart) {
		this.policyStart = policyStart;
	}
	public LocalDate getPolicyEnd() {
		return policyEnd;
	}
	public void setPolicyEnd(LocalDate policyEnd) {
		this.policyEnd = policyEnd;
	}
}
