package com.insurance.claim.dto.auth;

import com.insurance.claim.enums.RoleType;

public class AuthResponseDTO {

    private String token;
    private RoleType role;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, RoleType role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }
}
