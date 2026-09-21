package com.insurehub.service;

import com.insurehub.dto.ClaimDtos;
import com.insurehub.entity.Claim;
import com.insurehub.entity.ClaimStatus;
import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import com.insurehub.entity.User;
import com.insurehub.exception.InvalidPolicyStateException;
import com.insurehub.exception.PolicyNotFoundException;
import com.insurehub.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class ClaimService {

    private final ClaimRepository claims;
    private final PolicyService policyService;

    public ClaimService(
            ClaimRepository claims,
            PolicyService policyService
    ) {
        this.claims = claims;
        this.policyService = policyService;
    }

    @Transactional
    public ClaimDtos.ClaimResponse create(
            String email,
            ClaimDtos.CreateClaimRequest request
    ) {

        Policy policy =
                policyService.getEntity(
                        request.policyId(),
                        email,
                        false
                );

        if (!canClaim(policy)) {
            throw new InvalidPolicyStateException(
                    "Claims cannot be filed for policy "
                            + policy.getPolicyNumber()
                            + " in status "
                            + policy.getStatus()
                            + "."
            );
        }

        if (request.claimAmount()
                .compareTo(policy.getCoverageAmount()) > 0) {

            throw new IllegalArgumentException(
                    "Claim amount cannot exceed policy coverage."
            );
        }

        User user = policy.getUser();

        Claim claim = new Claim();

        claim.setClaimNumber(
                generateClaimNumber()
        );

        claim.setPolicy(policy);
        claim.setUser(user);
        claim.setClaimType(
                request.claimType().trim()
        );
        claim.setDescription(
                request.description().trim()
        );
        claim.setClaimAmount(
                request.claimAmount()
        );
        claim.setIncidentDate(
                request.incidentDate()
        );
        claim.setStatus(
                ClaimStatus.PENDING
        );

        claim = claims.save(claim);

        policyService.addHistory(
                policy,
                "CLAIM_FILED",
                "Claim "
                        + claim.getClaimNumber()
                        + " was filed for ₹"
                        + claim.getClaimAmount()
                        + ".",
                email
        );

        return map(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimDtos.ClaimResponse> mine(
            String email
    ) {

        User user =
                policyService.user(email);

        return claims
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClaimDtos.ClaimResponse get(
            Long id,
            String email
    ) {

        Claim claim =
                claims.findById(id)
                        .orElseThrow(() ->
                                new PolicyNotFoundException(
                                        "Claim not found."
                                )
                        );

        if (!claim.getUser()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "You are not allowed to access this claim."
            );
        }

        return map(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimDtos.ClaimResponse> all() {

        return claims
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional
    public ClaimDtos.ClaimResponse updateStatus(
            Long id,
            ClaimDtos.UpdateClaimRequest request,
            String adminEmail
    ) {

        Claim claim =
                claims.findById(id)
                        .orElseThrow(() ->
                                new PolicyNotFoundException(
                                        "Claim not found."
                                )
                        );

        claim.setStatus(
                request.status()
        );

        claim.setAdminRemarks(
                request.adminRemarks()
        );

        claim = claims.save(claim);

        policyService.addHistory(
                claim.getPolicy(),
                "CLAIM_" + request.status().name(),
                "Claim "
                        + claim.getClaimNumber()
                        + " was marked "
                        + request.status().name()
                        + "."
                        + (
                        request.adminRemarks() == null
                                || request.adminRemarks().isBlank()
                                ? ""
                                : " Admin remarks: "
                                + request.adminRemarks()
                ),
                adminEmail
        );

        return map(claim);
    }

    private boolean canClaim(Policy policy) {

        return policy.getStatus() == PolicyStatus.ACTIVE
                || policy.getStatus() == PolicyStatus.RENEWED
                || policy.getStatus() == PolicyStatus.EXPIRED;
    }

    private String generateClaimNumber() {

        return "CLM-"
                + Year.now().getValue()
                + "-"
                + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private ClaimDtos.ClaimResponse map(
            Claim claim
    ) {

        return new ClaimDtos.ClaimResponse(
                claim.getId(),
                claim.getClaimNumber(),
                claim.getPolicy().getId(),
                claim.getPolicy().getPolicyNumber(),
                claim.getUser().getName(),
                claim.getUser().getEmail(),
                claim.getClaimType(),
                claim.getDescription(),
                claim.getClaimAmount(),
                claim.getIncidentDate(),
                claim.getStatus(),
                claim.getAdminRemarks(),
                claim.getCreatedAt(),
                claim.getUpdatedAt()
        );
    }
}