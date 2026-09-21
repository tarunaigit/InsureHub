package com.insurehub.dto;

import com.insurehub.entity.PlanStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public final class PlanDtos {

    private PlanDtos() {}

    public record PlanRequest(
            @NotBlank String name,

            @NotBlank String type,

            @NotBlank String description,

            @NotNull
            @DecimalMin("1")
            BigDecimal coverageAmount,

            @NotNull
            @DecimalMin("1")
            BigDecimal minCoverageAmount,

            @NotNull
            @DecimalMin("1")
            BigDecimal maxCoverageAmount,

            @NotNull
            @DecimalMin("1")
            BigDecimal basePremium,

            @NotNull
            @Min(1)
            Integer durationYears,

            @DecimalMin("0")
            @DecimalMax("10")
            BigDecimal discountPercent
    ) {}

    public record PlanResponse(
            Long id,
            String name,
            String type,
            String description,
            BigDecimal coverageAmount,
            BigDecimal minCoverageAmount,
            BigDecimal maxCoverageAmount,
            BigDecimal basePremium,
            Integer durationYears,
            BigDecimal discountPercent,
            PlanStatus status
    ) {}
}