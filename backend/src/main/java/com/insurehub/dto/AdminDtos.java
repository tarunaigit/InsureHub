package com.insurehub.dto;

import java.math.BigDecimal;

public final class AdminDtos {

    private AdminDtos() {}

    public record StatsResponse(
            long customers,
            long plans,
            long policies,
            long activePolicies,
            long renewalDue,
            long cancellationRequests,
            BigDecimal totalCoverage
    ) {}

    public record CancellationResponse(
            Long policyId,
            String policyNumber,
            String customerName,
            String customerEmail,
            String planName,
            String requestedStatus,
            String requestedOn
    ) {}
}