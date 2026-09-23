package com.insurehub.controller;

import com.insurehub.dto.ClaimDtos;
import com.insurehub.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ClaimController {

  private final ClaimService claims;

  public ClaimController(ClaimService claims) {
    this.claims = claims;
  }

  @PostMapping("/claims")
  public ClaimDtos.ClaimResponse create(
      Authentication authentication,
      @Valid @RequestBody ClaimDtos.CreateClaimRequest request) {
    return claims.create(
        authentication.getName(),
        request);
  }

  @GetMapping("/claims/my")
  public List<ClaimDtos.ClaimResponse> mine(
      Authentication authentication) {
    return claims.mine(
        authentication.getName());
  }

  @GetMapping("/claims/{id}")
  public ClaimDtos.ClaimResponse get(
      Authentication authentication,
      @PathVariable Long id) {
    return claims.get(
        id,
        authentication.getName());
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/admin/claims")
  public List<ClaimDtos.ClaimResponse> all() {
    return claims.all();
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/admin/claims/{id}/status")
  public ClaimDtos.ClaimResponse updateStatus(
      Authentication authentication,
      @PathVariable Long id,
      @Valid @RequestBody ClaimDtos.UpdateClaimRequest request) {
    return claims.updateStatus(
        id,
        request,
        authentication.getName());
  }
}