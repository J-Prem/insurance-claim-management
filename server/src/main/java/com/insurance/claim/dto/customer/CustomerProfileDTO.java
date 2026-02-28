package com.insurance.claim.dto.customer;

import java.time.LocalDate;

public class CustomerProfileDTO {

    private String fullName;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private boolean profileCompleted;

    // getters & setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public boolean isProfileCompleted() { return profileCompleted; }
    public void setProfileCompleted(boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }
}
