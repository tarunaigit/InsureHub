package com.insurehub.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public final class QuoteDtos {

    private QuoteDtos() {}

    public record QuoteRequest(
            @NotNull Long planId,
            @Min(18) @Max(100) Integer age,
            @NotNull
            @DecimalMin("1")
            BigDecimal coverageAmount,
            @NotNull
            @Min(1)
            Integer durationYears,
            String riskCategory
    ) {}

    public record QuoteResponse(
            Long planId,
            String planName,
            BigDecimal basePremium,
            BigDecimal ageFactor,
            BigDecimal coverageFactor,
            BigDecimal riskFactor,
            BigDecimal discount,
            BigDecimal finalPremium,
            Integer age,
            BigDecimal coverageAmount,
            Integer durationYears,
            String riskCategory
    ) {}
}