package com.insurehub.service;

import com.insurehub.dto.QuoteDtos;
import com.insurehub.entity.InsurancePlan;
import com.insurehub.entity.User;
import com.insurehub.exception.ApiException;
import com.insurehub.exception.PlanNotFoundException;
import com.insurehub.repository.PlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PremiumService {

    private final PlanRepository plans;

    public PremiumService(PlanRepository plans) {
        this.plans = plans;
    }

    /*
     * Main premium calculation.
     *
     * The discount is taken from the selected insurance plan
     * stored in PostgreSQL.
     *
     * The client cannot decide the discount.
     */
    public QuoteDtos.QuoteResponse calculate(
            QuoteDtos.QuoteRequest request
    ) {

        InsurancePlan plan =
                plans.findById(request.planId())
                        .orElseThrow(() ->
                                new PlanNotFoundException(
                                        "Plan "
                                                + request.planId()
                                                + " not found"
                                )
                        );

        validate(
                plan,
                request.age(),
                request.coverageAmount(),
                request.durationYears()
        );

        int age =
                request.age() == null
                        ? 30
                        : request.age();

        String risk =
                normalizeRisk(
                        request.riskCategory()
                );

        BigDecimal base =
                plan.getBasePremium()
                        .multiply(
                                BigDecimal.valueOf(
                                        request.durationYears()
                                )
                        );

        BigDecimal ageFactor =
                age <= 30
                        ? BigDecimal.valueOf(500)
                        : age <= 45
                                ? BigDecimal.valueOf(1000)
                                : BigDecimal.valueOf(2000);

        BigDecimal coverageFactor =
                request.coverageAmount()
                        .divide(
                                BigDecimal.valueOf(250),
                                2,
                                RoundingMode.HALF_UP
                        );

        BigDecimal riskFactor =
                switch (risk) {
                    case "LOW" ->
                            BigDecimal.ZERO;

                    case "MEDIUM" ->
                            BigDecimal.valueOf(500);

                    default ->
                            BigDecimal.valueOf(1000);
                };

        /*
         * SECURITY FIX:
         *
         * The discount comes from InsurancePlan.
         *
         * It does NOT come from:
         * request.discountPercent()
         *
         * Therefore a customer cannot modify the discount
         * by changing the HTTP request.
         */
        BigDecimal discountPercent =
                plan.getDiscountPercent();

        /*
         * Extra server-side protection.
         */
        if (
                discountPercent.compareTo(
                        BigDecimal.ZERO
                ) < 0
                        ||
                discountPercent.compareTo(
                        BigDecimal.TEN
                ) > 0
        ) {

            throw new ApiException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "INVALID_DISCOUNT_CONFIGURATION",
                    "Invalid plan discount configuration."
            );
        }

        BigDecimal subtotal =
                base
                        .add(ageFactor)
                        .add(coverageFactor)
                        .add(riskFactor);

        BigDecimal discount =
                subtotal
                        .multiply(
                                discountPercent
                        )
                        .divide(
                                BigDecimal.valueOf(100),
                                2,
                                RoundingMode.HALF_UP
                        );

        BigDecimal finalPremium =
                subtotal
                        .subtract(discount)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        return new QuoteDtos.QuoteResponse(
                plan.getId(),
                plan.getName(),
                base,
                ageFactor,
                coverageFactor,
                riskFactor,
                discount,
                finalPremium,
                age,
                request.coverageAmount(),
                request.durationYears(),
                risk
        );
    }

    /*
     * Compatibility method for existing QuoteController.
     */
    public QuoteDtos.QuoteResponse calculate(
            String email,
            QuoteDtos.QuoteRequest request
    ) {
        return calculate(request);
    }

    /*
     * Compatibility method for existing PolicyService /
     * RenewalService.
     *
     * The User is not used to determine the discount.
     * The selected plan determines the discount.
     */
    public QuoteDtos.QuoteResponse calculate(
            User user,
            QuoteDtos.QuoteRequest request
    ) {
        return calculate(request);
    }

    public void validate(
            InsurancePlan plan,
            Integer age,
            BigDecimal coverage,
            Integer duration
    ) {

        if (
                age != null
                        &&
                (age < 18 || age > 100)
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_AGE",
                    "Age must be between 18 and 100."
            );
        }

        if (
                coverage.compareTo(
                        plan.getMinCoverageAmount()
                ) < 0
                        ||
                coverage.compareTo(
                        plan.getMaxCoverageAmount()
                ) > 0
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_COVERAGE",
                    "Coverage is outside this plan's allowed limits."
            );
        }

        if (
                duration >
                        plan.getDurationYears()
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_DURATION",
                    "Duration exceeds the selected plan limit."
            );
        }
    }

    public String normalizeRisk(
            String risk
    ) {

        if (
                risk == null
                        ||
                risk.isBlank()
        ) {

            return "MEDIUM";
        }

        String normalized =
                risk.trim()
                        .toUpperCase();

        if (
                !normalized.equals("LOW")
                        &&
                !normalized.equals("MEDIUM")
                        &&
                !normalized.equals("HIGH")
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_RISK",
                    "Risk must be LOW, MEDIUM or HIGH."
            );
        }

        return normalized;
    }
}