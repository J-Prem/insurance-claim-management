package com.insurance.claim.controller.customer;

import org.springframework.web.bind.annotation.*;

import com.insurance.claim.dto.customer.CustomerProfileDTO;
import com.insurance.claim.entity.CustomerProfile;
import com.insurance.claim.service.customer.CustomerProfileService;

@RestController
@RequestMapping("/api/customer/profile")
@CrossOrigin("*")
public class CustomerProfileController {

    private final CustomerProfileService service;

    public CustomerProfileController(CustomerProfileService service) {
        this.service = service;
    }

    // ✅ Create / Update profile
    @PostMapping
    public CustomerProfileDTO saveProfile(
            @RequestBody CustomerProfileDTO dto
    ) {
        return service.saveProfile(dto);
    }

    // ✅ Get my profile
    @GetMapping
    public CustomerProfileDTO getMyProfile() {
        return service.getMyProfile();
    }
}
