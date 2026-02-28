package com.insurance.claim.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.insurance.claim.exception.UnauthorizedException;

public final class SecurityUtil {

    private SecurityUtil() {
        // Utility class (no object creation)
    }

    /**
     * Get logged-in username from JWT
     */
    public static String getCurrentUsername() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }

        throw new UnauthorizedException("Invalid authentication principal");
    }

    /**
     * Get logged-in user ID (VERY IMPORTANT)
     */
    public static Long getCurrentUserId() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return customUserDetails.getUserId();
        }

        throw new UnauthorizedException("Invalid user details");
    }

    /**
     * Get logged-in user's role (ADMIN / CUSTOMER / SURVEYOR)
     */
    public static String getCurrentUserRole() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return customUserDetails.getRole();
        }

        throw new UnauthorizedException("Invalid user role");
    }

    /**
     * Role check helper
     */
    public static boolean hasRole(String role) {
        return getCurrentUserRole().equalsIgnoreCase(role);
    }
}
