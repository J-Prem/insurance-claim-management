package com.insurance.claim.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.insurance.claim.entity.Users;
import com.insurance.claim.enums.RoleType;
import com.insurance.claim.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // --- SEED ADMIN ---
        if (!userRepository.existsByUsername("admin")) {
            Users admin = new Users();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(RoleType.ADMIN);
            admin.setStatus("ACTIVE");
            admin.setAvailable(true);
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded: admin / admin123");
        }

        // --- SEED CUSTOMER ---
        if (!userRepository.existsByUsername("customer")) {
            Users customer = new Users();
            customer.setUsername("customer");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setRole(RoleType.CUSTOMER);
            customer.setStatus("ACTIVE");
            customer.setAvailable(true);
            userRepository.save(customer);
            System.out.println("✅ Customer user seeded: customer / customer123");
        }

        // --- SEED SURVEYOR ---
        if (!userRepository.existsByUsername("surveyor")) {
            Users surveyor = new Users();
            surveyor.setUsername("surveyor");
            surveyor.setPassword(passwordEncoder.encode("surveyor123"));
            surveyor.setRole(RoleType.SURVEYOR);
            surveyor.setStatus("ACTIVE");
            surveyor.setAvailable(true);
            userRepository.save(surveyor);
            System.out.println("✅ Surveyor user seeded: surveyor / surveyor123");
        }
    }
}
