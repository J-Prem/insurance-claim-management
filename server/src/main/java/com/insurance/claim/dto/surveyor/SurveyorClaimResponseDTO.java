package com.insurance.claim.dto.surveyor;

import com.insurance.claim.enums.ClaimStatus;
import java.time.LocalDate;

public class SurveyorClaimResponseDTO {

	private Long claimId;
	private String reason;
	private double claimAmount;
	private ClaimStatus status;

	private String customerUsername;
	private String policyName;
	private LocalDate policyStart;
	private LocalDate policyEnd;
	private Double approvedAmount;
	private boolean fraudSuspected;
	private String fraudNotes;

	public Double getApprovedAmount() {
		return approvedAmount;
	}

	public void setApprovedAmount(Double approvedAmount) {
		this.approvedAmount = approvedAmount;
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

}
