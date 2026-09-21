package com.insurehub.service;

import com.insurehub.dto.PlanDtos;
import com.insurehub.entity.InsurancePlan;
import com.insurehub.entity.PlanStatus;
import com.insurehub.exception.ApiException;
import com.insurehub.exception.PlanNotFoundException;
import com.insurehub.repository.PlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PlanService {

    private final PlanRepository plans;

    public PlanService(
            PlanRepository plans
    ) {
        this.plans = plans;
    }

    public List<PlanDtos.PlanResponse> active() {

        return plans
                .findByStatusOrderByName(
                        PlanStatus.ACTIVE
                )
                .stream()
                .map(this::map)
                .toList();
    }

    public List<PlanDtos.PlanResponse> all() {

        return plans
                .findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public PlanDtos.PlanResponse get(
            Long id
    ) {

        return map(
                plans.findById(id)
                        .orElseThrow(() ->
                                new PlanNotFoundException(
                                        "Plan "
                                                + id
                                                + " not found"
                                )
                        )
        );
    }

    public PlanDtos.PlanResponse create(
            PlanDtos.PlanRequest request
    ) {

        InsurancePlan plan =
                new InsurancePlan();

        apply(
                plan,
                request
        );

        return map(
                plans.save(plan)
        );
    }

    public PlanDtos.PlanResponse update(
            Long id,
            PlanDtos.PlanRequest request
    ) {

        InsurancePlan plan =
                plans.findById(id)
                        .orElseThrow(() ->
                                new PlanNotFoundException(
                                        "Plan "
                                                + id
                                                + " not found"
                                )
                        );

        apply(
                plan,
                request
        );

        return map(
                plans.save(plan)
        );
    }

    public PlanDtos.PlanResponse deactivate(
            Long id
    ) {

        InsurancePlan plan =
                plans.findById(id)
                        .orElseThrow(() ->
                                new PlanNotFoundException(
                                        "Plan "
                                                + id
                                                + " not found"
                                )
                        );

        plan.setStatus(
                PlanStatus.INACTIVE
        );

        return map(
                plans.save(plan)
        );
    }

    private void apply(
            InsurancePlan plan,
            PlanDtos.PlanRequest request
    ) {

        if (
                request.minCoverageAmount()
                        .compareTo(
                                request.maxCoverageAmount()
                        ) > 0
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_PLAN_LIMITS",
                    "Minimum coverage cannot exceed maximum coverage."
            );
        }

        BigDecimal discount =
                request.discountPercent() == null
                        ? BigDecimal.ZERO
                        : request.discountPercent();

        /*
         * Server-side validation.
         * Even if somebody bypasses frontend validation,
         * the backend will not accept more than 10%.
         */
        if (
                discount.compareTo(
                        BigDecimal.ZERO
                ) < 0
                        ||
                discount.compareTo(
                        BigDecimal.TEN
                ) > 0
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_DISCOUNT",
                    "Plan discount must be between 0% and 10%."
            );
        }

        plan.setName(
                request.name().trim()
        );

        plan.setType(
                request.type()
                        .trim()
                        .toUpperCase()
        );

        plan.setDescription(
                request.description().trim()
        );

        plan.setCoverageAmount(
                request.coverageAmount()
        );

        plan.setMinCoverageAmount(
                request.minCoverageAmount()
        );

        plan.setMaxCoverageAmount(
                request.maxCoverageAmount()
        );

        plan.setBasePremium(
                request.basePremium()
        );

        plan.setDurationYears(
                request.durationYears()
        );

        plan.setDiscountPercent(
                discount
        );
    }

    private PlanDtos.PlanResponse map(
            InsurancePlan plan
    ) {

        return new PlanDtos.PlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getType(),
                plan.getDescription(),
                plan.getCoverageAmount(),
                plan.getMinCoverageAmount(),
                plan.getMaxCoverageAmount(),
                plan.getBasePremium(),
                plan.getDurationYears(),
                plan.getDiscountPercent(),
                plan.getStatus()
        );
    }
}