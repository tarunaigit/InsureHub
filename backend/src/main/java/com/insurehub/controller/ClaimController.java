package com.insurehub.controller;

import com.insurehub.dto.ClaimDtos;
import com.insurehub.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claims;

    public ClaimController(
            ClaimService claims
    ) {
        this.claims = claims;
    }

    @PostMapping
    public ClaimDtos.ClaimResponse create(
            Authentication authentication,
            @Valid @RequestBody
            ClaimDtos.CreateClaimRequest request
    ) {

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            throw new AccessDeniedException(
                    "Admins cannot file claims."
            );
        }

        return claims.create(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/my")
    public List<ClaimDtos.ClaimResponse> mine(
            Authentication authentication
    ) {

        return claims.mine(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    public ClaimDtos.ClaimResponse get(
            Authentication authentication,
            @PathVariable Long id
    ) {

        return claims.get(
                id,
                authentication.getName()
        );
    }
}