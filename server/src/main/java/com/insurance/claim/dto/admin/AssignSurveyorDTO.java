package com.insurance.claim.dto.admin;

public class AssignSurveyorDTO {

    private Long claimId;
    private Long surveyorId;

    public AssignSurveyorDTO() {}

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public Long getSurveyorId() {
        return surveyorId;
    }

    public void setSurveyorId(Long surveyorId) {
        this.surveyorId = surveyorId;
    }
}
