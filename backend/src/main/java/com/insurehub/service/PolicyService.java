package com.insurehub.service;

import com.insurehub.dto.PolicyDtos;
import com.insurehub.dto.QuoteDtos;
import com.insurehub.entity.*;
import com.insurehub.exception.*;
import com.insurehub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class PolicyService {

    private final PolicyRepository policies;
    private final UserRepository users;
    private final PlanRepository plans;
    private final HistoryRepository history;
    private final PaymentRepository payments;
    private final PremiumService premium;

    public PolicyService(
            PolicyRepository policies,
            UserRepository users,
            PlanRepository plans,
            HistoryRepository history,
            PaymentRepository payments,
            PremiumService premium) {

        this.policies = policies;
        this.users = users;
        this.plans = plans;
        this.history = history;
        this.payments = payments;
        this.premium = premium;
    }

    /*
     * Automatically marks ACTIVE and RENEWED policies as EXPIRED
     * when their expiry date has passed.
     */
    @Transactional
    public void expirePolicies() {

        LocalDate today = LocalDate.now();

        policies.findByStatusInAndExpiryDateBefore(
                List.of(
                        PolicyStatus.ACTIVE,
                        PolicyStatus.RENEWED
                ),
                today
        ).forEach(policy -> {

            policy.setStatus(PolicyStatus.EXPIRED);

            addHistory(
                    policy,
                    "EXPIRED",
                    "Policy expired on " + policy.getExpiryDate() + ".",
                    "SYSTEM"
            );

            policies.save(policy);
        });
    }

    @Transactional
    public PolicyDtos.PolicyResponse purchase(
            String email,
            PolicyDtos.PurchasePolicyRequest request) {

        User user = user(email);

        InsurancePlan plan = plans.findById(
                request.planId()
        ).orElseThrow(
                () -> new PlanNotFoundException(
                        "Plan "
                                + request.planId()
                                + " not found"
                )
        );

        if (plan.getStatus() != PlanStatus.ACTIVE) {

            throw new PlanNotFoundException(
                    "Selected plan is inactive."
            );
        }

        int age = request.age() == null
                ? 30
                : request.age();

        String risk = premium.normalizeRisk(
                request.riskCategory()
        );

        /*
         * SECURITY FIX:
         *
         * Purchase premium is recalculated on the server.
         * User discount is retrieved from the database through
         * the authenticated User object.
         */
        QuoteDtos.QuoteRequest quoteRequest =
                new QuoteDtos.QuoteRequest(
                        request.planId(),
                        age,
                        request.coverageAmount(),
                        request.durationYears(),
                        risk
                );

        QuoteDtos.QuoteResponse quote =
                premium.calculate(
                        user,
                        quoteRequest
                );

        Policy policy = new Policy();

        policy.setPolicyNumber(
                generateNumber()
        );

        policy.setUser(
                user
        );

        policy.setPlan(
                plan
        );

        policy.setPremium(
                quote.finalPremium()
        );

        policy.setCoverageAmount(
                quote.coverageAmount()
        );

        policy.setDurationYears(
                quote.durationYears()
        );

        policy.setAge(
                quote.age()
        );

        policy.setRiskCategory(
                quote.riskCategory()
        );

        policy.setStartDate(
                LocalDate.now()
        );

        policy.setExpiryDate(
                LocalDate.now()
                        .plusYears(
                                quote.durationYears()
                        )
                        .minusDays(1)
        );

        policy.setStatus(
                PolicyStatus.ACTIVE
        );

        policy = policies.save(policy);

        addHistory(
                policy,
                "CREATED",
                "Policy purchased and activated.",
                email
        );

        addHistory(
                policy,
                "ACTIVATED",
                "Policy is active from "
                        + policy.getStartDate()
                        + " to "
                        + policy.getExpiryDate()
                        + ".",
                email
        );

        Payment payment = new Payment();

        payment.setPolicy(
                policy
        );

        payment.setAmount(
                policy.getPremium()
        );

        payment.setGateway(
                "MOCK"
        );

        payment.setStatus(
                PaymentStatus.PENDING
        );

        payments.save(
                payment
        );

        return map(
                policy
        );
    }

    @Transactional(readOnly = true)
    public List<PolicyDtos.PolicyResponse> mine(
            String email) {

        User user = user(email);

        return policies
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional(readOnly = true)
    public Policy getEntity(
            Long id,
            String email,
            boolean admin) {

        Policy policy = policies.findById(id)
                .orElseThrow(
                        () -> new PolicyNotFoundException(
                                "Policy "
                                        + id
                                        + " not found"
                        )
                );

        if (!admin &&
                !policy.getUser()
                        .getEmail()
                        .equalsIgnoreCase(email)) {

            throw new UnauthorizedPolicyAccessException(
                    "You are not allowed to access this policy."
            );
        }

        return policy;
    }

    @Transactional(readOnly = true)
    public PolicyDtos.PolicyResponse get(
            Long id,
            String email,
            boolean admin) {

        return map(
                getEntity(
                        id,
                        email,
                        admin
                )
        );
    }

    @Transactional(readOnly = true)
    public List<PolicyDtos.HistoryResponse> history(
            Long id,
            String email,
            boolean admin) {

        getEntity(
                id,
                email,
                admin
        );

        return historyFor(
                id
        );
    }

    public List<PolicyDtos.HistoryResponse> historyFor(
            Long id) {

        return history
                .findByPolicyIdOrderByTimestampAsc(
                        id
                )
                .stream()
                .map(h ->
                        new PolicyDtos.HistoryResponse(
                                h.getId(),
                                h.getAction(),
                                h.getDescription(),
                                h.getPerformedBy(),
                                h.getTimestamp()
                        )
                )
                .toList();
    }

    public PolicyDtos.PolicyResponse map(
            Policy policy) {

        return new PolicyDtos.PolicyResponse(
                policy.getId(),
                policy.getPolicyNumber(),
                policy.getPlan().getName(),
                policy.getPlan().getType(),
                policy.getPremium(),
                policy.getCoverageAmount(),
                policy.getDurationYears(),
                policy.getAge(),
                policy.getRiskCategory(),
                policy.getStartDate(),
                policy.getExpiryDate(),
                policy.getStatus(),
                policy.getUser().getName(),
                policy.getUser().getEmail(),
                policy.getCreatedAt()
        );
    }

    User user(
            String email) {

        return users
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () ->
                                new UserNotFoundException(
                                        "User not found"
                                )
                );
    }

    void addHistory(
            Policy policy,
            String action,
            String description,
            String by) {

        PolicyHistory historyEntry =
                new PolicyHistory();

        historyEntry.setPolicy(
                policy
        );

        historyEntry.setAction(
                action
        );

        historyEntry.setDescription(
                description
        );

        historyEntry.setPerformedBy(
                by
        );

        history.save(
                historyEntry
        );
    }

    String generateNumber() {

        String number;

        do {

            number =
                    "INS-"
                            + Year.now().getValue()
                            + "-"
                            + UUID.randomUUID()
                            .toString()
                            .replace(
                                    "-",
                                    ""
                            )
                            .substring(
                                    0,
                                    8
                            )
                            .toUpperCase();

        } while (
                policies.existsByPolicyNumber(
                        number
                )
        );

        return number;
    }

    public void save(
            Policy policy) {

        policies.save(
                policy
        );
    }

    public HistoryRepository historyRepo() {
        return history;
    }

    public PaymentRepository paymentRepo() {
        return payments;
    }
}