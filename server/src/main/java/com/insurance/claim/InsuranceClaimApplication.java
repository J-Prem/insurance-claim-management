package com.insurance.claim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InsuranceClaimApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuranceClaimApplication.class, args);
    }
}
