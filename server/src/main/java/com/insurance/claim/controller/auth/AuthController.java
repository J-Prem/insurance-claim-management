package com.insurance.claim.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.insurance.claim.dto.auth.AuthResponseDTO;
import com.insurance.claim.dto.auth.LoginRequestDTO;
import com.insurance.claim.entity.Users;
import com.insurance.claim.service.auth.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public Users register(@RequestBody Users user) {
        return authService.registerUser(user);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return authService.login(dto);
    }
}
