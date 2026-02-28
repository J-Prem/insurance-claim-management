package com.insurance.claim.controller.customer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.insurance.claim.dto.customer.ApplyPolicyDTO;
import com.insurance.claim.dto.customer.RaiseClaimDTO;
import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.CustomerPolicy;
import com.insurance.claim.entity.Policy;
import com.insurance.claim.entity.PolicyCoverage;
import com.insurance.claim.dto.customer.ClaimResponseDTO;
import com.insurance.claim.service.customer.CustomerService;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/policies")
    public List<Policy> getPolicies() {
        return customerService.getActivePolicies();
    }

    @PostMapping("/apply-policy")
    public CustomerPolicy applyPolicy(@RequestBody ApplyPolicyDTO dto) {
        return customerService.applyPolicy(dto);
    }

    @PostMapping("/raise-claim")
    public ClaimResponseDTO raiseClaim(@RequestBody RaiseClaimDTO dto) {
        return customerService.raiseClaim(dto);
    }

    @GetMapping("/claims")
    public List<ClaimResponseDTO> getMyClaims() {
        return customerService.getMyClaims();
    }

    @GetMapping("/policy/coverage")
    public List<PolicyCoverage> getMyCoverage() {
        return customerService.getMyPolicyCoverage();
    }

    @GetMapping("/my-policies")
    public List<com.insurance.claim.entity.CustomerPolicy> getMyPolicies() {
        return customerService.getMyPolicies();
    }

}
