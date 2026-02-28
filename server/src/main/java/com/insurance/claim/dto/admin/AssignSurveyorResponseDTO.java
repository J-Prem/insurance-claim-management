package com.insurance.claim.dto.admin;

import com.insurance.claim.enums.ClaimStatus;

public class AssignSurveyorResponseDTO {

    private Long claimId;
    private ClaimStatus status;
    private String surveyorUsername;

    public AssignSurveyorResponseDTO() {}

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getSurveyorUsername() {
        return surveyorUsername;
    }

    public void setSurveyorUsername(String surveyorUsername) {
        this.surveyorUsername = surveyorUsername;
    }
}
