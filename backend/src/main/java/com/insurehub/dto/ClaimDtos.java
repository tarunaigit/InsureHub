package com.insurehub.dto;

import com.insurehub.entity.ClaimStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public final class ClaimDtos {

    private ClaimDtos() {}

    public record CreateClaimRequest(

            @NotNull
            Long policyId,

            @NotBlank
            @Size(max = 100)
            String claimType,

            @NotBlank
            @Size(max = 3000)
            String description,

            @NotNull
            @DecimalMin(value = "0.01")
            BigDecimal claimAmount,

            @NotNull
            @PastOrPresent
            LocalDate incidentDate
    ) {}

    public record UpdateClaimRequest(

            @NotNull
            ClaimStatus status,

            @Size(max = 2000)
            String adminRemarks
    ) {}

    public record ClaimResponse(
            Long id,
            String claimNumber,
            Long policyId,
            String policyNumber,
            String customerName,
            String customerEmail,
            String claimType,
            String description,
            BigDecimal claimAmount,
            LocalDate incidentDate,
            ClaimStatus status,
            String adminRemarks,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}
}