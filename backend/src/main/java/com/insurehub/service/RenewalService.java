package com.insurehub.service;

import com.insurehub.dto.PolicyDtos;
import com.insurehub.dto.QuoteDtos;
import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import com.insurehub.exception.InvalidPolicyStateException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class RenewalService {

    private final PolicyService policyService;
    private final PremiumService premium;

    public RenewalService(
            PolicyService policyService,
            PremiumService premium
    ) {
        this.policyService =
                policyService;

        this.premium =
                premium;
    }

    @Transactional
    public PolicyDtos.PolicyResponse renew(
            Long id,
            String email
    ) {

        Policy policy =
                policyService.getEntity(
                        id,
                        email,
                        false
                );

        if (policy.getStatus()
                        == PolicyStatus.CANCEL_REQUESTED
                ||
                policy.getStatus()
                        == PolicyStatus.CANCELLED) {

            throw new InvalidPolicyStateException(
                    "Policy "
                            + policy.getPolicyNumber()
                            + " cannot be renewed in status "
                            + policy.getStatus()
                            + "."
            );
        }

        if (policy.getStatus()
                        != PolicyStatus.ACTIVE
                &&
                policy.getStatus()
                        != PolicyStatus.RENEWED
                &&
                policy.getStatus()
                        != PolicyStatus.EXPIRED) {

            throw new InvalidPolicyStateException(
                    "Policy "
                            + policy.getPolicyNumber()
                            + " is not eligible for renewal."
            );
        }

        /*
         * Renewal also uses the server-side customer discount.
         */
        QuoteDtos.QuoteRequest request =
                new QuoteDtos.QuoteRequest(
                        policy.getPlan().getId(),
                        policy.getAge(),
                        policy.getCoverageAmount(),
                        policy.getDurationYears(),
                        policy.getRiskCategory()
                );

        QuoteDtos.QuoteResponse quote =
                premium.calculate(
                        policy.getUser(),
                        request
                );

        LocalDate today =
                LocalDate.now();

        LocalDate base =
                policy.getExpiryDate()
                        .isAfter(today)
                        ?
                        policy.getExpiryDate()
                                .plusDays(1)
                        :
                        today;

        if (policy.getExpiryDate()
                .isBefore(today)) {

            policy.setStartDate(
                    today
            );
        }

        policy.setPremium(
                quote.finalPremium()
        );

        policy.setExpiryDate(
                base
                        .plusYears(
                                policy.getDurationYears()
                        )
                        .minusDays(1)
        );

        policy.setStatus(
                PolicyStatus.RENEWED
        );

        policyService.save(
                policy
        );

        policyService.addHistory(
                policy,
                "RENEWED",
                "Policy renewed. New expiry: "
                        + policy.getExpiryDate()
                        + ". Premium: ₹"
                        + policy.getPremium(),
                email
        );

        return policyService.map(
                policy
        );
    }
}