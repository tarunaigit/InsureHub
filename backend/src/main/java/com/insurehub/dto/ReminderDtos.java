package com.insurehub.dto;

import com.insurehub.entity.ReminderStatus;

import java.time.LocalDateTime;

public final class ReminderDtos {

    private ReminderDtos() {}

    public record ReminderResponse(
            Long id,
            Long policyId,
            String policyNumber,
            String recipientEmail,
            String subject,
            String message,
            ReminderStatus status,
            LocalDateTime sentAt,
            LocalDateTime createdAt
    ) {}
}