package com.insurehub.dto;

import com.insurehub.entity.Role;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        Role role,
        LocalDateTime createdAt,
        BigDecimal eligibleDiscountPercent
) {}