package com.insurehub.controller;

import com.insurehub.dto.ClaimDtos;
import com.insurehub.service.ClaimService;
import jakarta.validation.Valid;
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