package com.insurehub.dto;

import com.insurehub.entity.PolicyStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public final class PolicyDtos {

    private PolicyDtos() {}

    public record PurchasePolicyRequest(
            @NotNull Long planId,

            @NotNull
            @DecimalMin("1")
            BigDecimal coverageAmount,

            @NotNull
            @Min(1)
            Integer durationYears,

            @Min(18)
            Integer age,

            String riskCategory
    ) {}

    public record PolicyResponse(
            Long id,
            String policyNumber,
            String planName,
            String planType,
            BigDecimal premium,
            BigDecimal coverageAmount,
            Integer durationYears,
            Integer age,
            String riskCategory,
            LocalDate startDate,
            LocalDate expiryDate,
            PolicyStatus status,
            String ownerName,
            String ownerEmail,
            LocalDateTime createdAt
    ) {}

    public record HistoryResponse(
            Long id,
            String action,
            String description,
            String performedBy,
            LocalDateTime timestamp
    ) {}
}