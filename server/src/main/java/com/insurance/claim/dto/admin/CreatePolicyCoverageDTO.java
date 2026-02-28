package com.insurance.claim.dto.admin;

public class CreatePolicyCoverageDTO {

    private Long policyId;
    private String coverageName;
    private double coverageLimit;

    public Long getPolicyId() {
        return policyId;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
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
}
