package com.insurance.claim.dto.admin;

import com.insurance.claim.enums.ClaimStatus;
import java.time.LocalDate;

public class AdminClaimResponseDTO {

    private Long claimId;
    private String reason;
    private double claimAmount;
    private ClaimStatus status;

    private String customerUsername;
    private String policyName;

    private LocalDate policyStart;
    private LocalDate policyEnd;

    private String surveyorUsername;

	public Long getClaimId() {
		return claimId;
	}

	public void setClaimId(Long claimId) {
		this.claimId = claimId;
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

	public String getCustomerUsername() {
		return customerUsername;
	}

	public void setCustomerUsername(String customerUsername) {
		this.customerUsername = customerUsername;
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

	public String getSurveyorUsername() {
		return surveyorUsername;
	}

	public void setSurveyorUsername(String surveyorUsername) {
		this.surveyorUsername = surveyorUsername;
	}
   
}
