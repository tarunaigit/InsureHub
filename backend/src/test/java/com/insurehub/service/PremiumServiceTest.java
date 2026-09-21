package com.insurehub.service;

import com.insurehub.dto.QuoteDtos;
import com.insurehub.entity.InsurancePlan;
import com.insurehub.repository.PlanRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PremiumServiceTest {

    private InsurancePlan createPlan(
            BigDecimal discount
    ) {

        InsurancePlan plan =
                new InsurancePlan();

        plan.setName(
                "Health Secure Plus"
        );

        plan.setBasePremium(
                BigDecimal.valueOf(
                        10000
                )
        );

        plan.setMinCoverageAmount(
                BigDecimal.valueOf(
                        100000
                )
        );

        plan.setMaxCoverageAmount(
                BigDecimal.valueOf(
                        2000000
                )
        );

        plan.setDurationYears(
                1
        );

        plan.setDiscountPercent(
                discount
        );

        return plan;
    }

    private QuoteDtos.QuoteRequest request() {

        return new QuoteDtos.QuoteRequest(
                2L,
                25,
                BigDecimal.valueOf(
                        500000
                ),
                1,
                "LOW"
        );
    }

    @Test
    void zeroPercentPlanDiscount() {

        PlanRepository repository =
                Mockito.mock(
                        PlanRepository.class
                );

        InsurancePlan plan =
                createPlan(
                        BigDecimal.ZERO
                );

        Mockito.when(
                repository.findById(2L)
        ).thenReturn(
                Optional.of(plan)
        );

        PremiumService service =
                new PremiumService(
                        repository
                );

        var result =
                service.calculate(
                        request()
                );

        assertEquals(
                new BigDecimal(
                        "13000.00"
                ),
                result.finalPremium()
        );

        assertEquals(
                new BigDecimal(
                        "0.00"
                ),
                result.discount()
        );
    }

    @Test
    void fivePercentPlanDiscount() {

        PlanRepository repository =
                Mockito.mock(
                        PlanRepository.class
                );

        InsurancePlan plan =
                createPlan(
                        BigDecimal.valueOf(
                                5
                        )
                );

        Mockito.when(
                repository.findById(2L)
        ).thenReturn(
                Optional.of(plan)
        );

        PremiumService service =
                new PremiumService(
                        repository
                );

        var result =
                service.calculate(
                        request()
                );

        assertEquals(
                new BigDecimal(
                        "650.00"
                ),
                result.discount()
        );

        assertEquals(
                new BigDecimal(
                        "12350.00"
                ),
                result.finalPremium()
        );
    }

    @Test
    void elevenPercentPlanDiscountIsRejected() {

        PlanRepository repository =
                Mockito.mock(
                        PlanRepository.class
                );

        InsurancePlan plan =
                createPlan(
                        BigDecimal.valueOf(
                                11
                        )
                );

        Mockito.when(
                repository.findById(2L)
        ).thenReturn(
                Optional.of(plan)
        );

        PremiumService service =
                new PremiumService(
                        repository
                );

        assertThrows(
                com.insurehub.exception.ApiException.class,
                () ->
                        service.calculate(
                                request()
                        )
        );
    }
}