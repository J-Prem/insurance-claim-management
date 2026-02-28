package com.insurance.claim.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.insurance.claim.entity.CustomerPolicy;
import com.insurance.claim.repository.CustomerPolicyRepository;

@Component
public class PolicyExpirationTask {

    @Autowired
    private CustomerPolicyRepository customerPolicyRepo;

    /**
     * Runs every day at midnight to expire policies
     * Cron: "0 0 0 * * *"
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expirePolicies() {
        LocalDate today = LocalDate.now();
        List<CustomerPolicy> activePolicies = customerPolicyRepo.findAllByStatus("ACTIVE");

        for (CustomerPolicy cp : activePolicies) {
            if (cp.getEndDate().isBefore(today)) {
                cp.setStatus("EXPIRED");
                customerPolicyRepo.save(cp);
                System.out.println("Policy ID " + cp.getId() + " has been marked as EXPIRED.");
            }
        }
    }
}
