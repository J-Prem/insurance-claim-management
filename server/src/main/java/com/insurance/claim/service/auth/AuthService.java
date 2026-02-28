package com.insurance.claim.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurance.claim.dto.auth.*;
import com.insurance.claim.entity.Users;
import com.insurance.claim.enums.RoleType;
import com.insurance.claim.exception.ResourceNotFoundException;
import com.insurance.claim.repository.UserRepository;
import com.insurance.claim.security.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER USER
    public Users registerUser(Users user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (user.getRole() == null) {
            throw new RuntimeException("Role is required");
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // ✅ LOGIN → JWT
    public AuthResponseDTO login(LoginRequestDTO dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()
                )
        );

        Users user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getUsername());

        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponseDTO(token, user.getRole());
    }
}
