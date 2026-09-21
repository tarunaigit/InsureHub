package com.insurehub.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_plans")
public class InsurancePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal coverageAmount;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal minCoverageAmount;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal maxCoverageAmount;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal basePremium;

    @Column(nullable = false)
    private Integer durationYears;

    /*
     * Discount belongs to the insurance plan.
     * Only ADMIN users can create/update plans.
     */
    @Column(
            name = "discount_percent",
            precision = 5,
            scale = 2
    )
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanStatus status = PlanStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void touch() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getCoverageAmount() {
        return coverageAmount;
    }

    public BigDecimal getMinCoverageAmount() {
        return minCoverageAmount;
    }

    public BigDecimal getMaxCoverageAmount() {
        return maxCoverageAmount;
    }

    public BigDecimal getBasePremium() {
        return basePremium;
    }

    public Integer getDurationYears() {
        return durationYears;
    }

    public BigDecimal getDiscountPercent() {
        return discountPercent == null
                ? BigDecimal.ZERO
                : discountPercent;
    }

    public PlanStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setName(String value) {
        name = value;
    }

    public void setType(String value) {
        type = value;
    }

    public void setDescription(String value) {
        description = value;
    }

    public void setCoverageAmount(BigDecimal value) {
        coverageAmount = value;
    }

    public void setMinCoverageAmount(BigDecimal value) {
        minCoverageAmount = value;
    }

    public void setMaxCoverageAmount(BigDecimal value) {
        maxCoverageAmount = value;
    }

    public void setBasePremium(BigDecimal value) {
        basePremium = value;
    }

    public void setDurationYears(Integer value) {
        durationYears = value;
    }

    public void setDiscountPercent(BigDecimal value) {
        discountPercent =
                value == null
                        ? BigDecimal.ZERO
                        : value;
    }

    public void setStatus(PlanStatus value) {
        status = value;
    }
}