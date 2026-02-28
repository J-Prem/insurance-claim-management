package com.insurance.claim.service.customer;

import java.time.LocalDate;
import org.springframework.stereotype.Service;

import com.insurance.claim.dto.customer.CustomerProfileDTO;
import com.insurance.claim.entity.CustomerProfile;
import com.insurance.claim.entity.Users;
import com.insurance.claim.repository.CustomerProfileRepository;
import com.insurance.claim.repository.UserRepository;
import com.insurance.claim.security.SecurityUtil;

@Service
public class CustomerProfileService {

    private final CustomerProfileRepository profileRepo;
    private final UserRepository userRepo;

    public CustomerProfileService(
            CustomerProfileRepository profileRepo,
            UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }

    public CustomerProfileDTO saveProfile(CustomerProfileDTO dto) {

        Long userId = SecurityUtil.getCurrentUserId();

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerProfile profile = profileRepo
                .findById(userId)
                .orElse(new CustomerProfile());

        if (dto.getDateOfBirth() != null && dto.getDateOfBirth().isAfter(LocalDate.now().minusYears(18))) {
            throw new RuntimeException("Validation Error: You must be at least 18 years old.");
        }

        if (profileRepo.existsByPhoneAndIdNot(dto.getPhone(), userId)) {
            throw new RuntimeException(
                    "Validation Error: This phone number is already registered with another account.");
        }

        profile.setUser(user);
        profile.setFullName(dto.getFullName());
        profile.setPhone(dto.getPhone());
        profile.setAddress(dto.getAddress());
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setProfileCompleted(true);

        CustomerProfile saved = profileRepo.save(profile);

        return mapToDTO(saved);
    }

    public CustomerProfileDTO getMyProfile() {

        Long userId = SecurityUtil.getCurrentUserId();

        CustomerProfile profile = profileRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return mapToDTO(profile);
    }

    private CustomerProfileDTO mapToDTO(CustomerProfile profile) {

        CustomerProfileDTO dto = new CustomerProfileDTO();
        dto.setFullName(profile.getFullName());
        dto.setPhone(profile.getPhone());
        dto.setAddress(profile.getAddress());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setProfileCompleted(profile.isProfileCompleted());

        return dto;
    }
}
