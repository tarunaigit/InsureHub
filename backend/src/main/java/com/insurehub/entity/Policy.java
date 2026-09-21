package com.insurehub.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies", uniqueConstraints = @UniqueConstraint(name = "uk_policy_number", columnNames = "policy_number"))
public class Policy {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) private String policyNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "plan_id") private InsurancePlan plan;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal premium;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal coverageAmount;
    @Column(nullable = false) private Integer durationYears;
    @Column(nullable = false) private Integer age;
    @Column(nullable = false) private String riskCategory;
    @Column(nullable = false) private LocalDate startDate;
    @Column(nullable = false) private LocalDate expiryDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private PolicyStatus status;
    private PolicyStatus cancellationPreviousStatus;
    @Column(nullable = false) private LocalDateTime createdAt = LocalDateTime.now();
    @Column(nullable = false) private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate public void touch() { updatedAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public String getPolicyNumber() { return policyNumber; }
    public User getUser() { return user; }
    public InsurancePlan getPlan() { return plan; }
    public BigDecimal getPremium() { return premium; }
    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public Integer getDurationYears() { return durationYears; }
    public Integer getAge() { return age; }
    public String getRiskCategory() { return riskCategory; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public PolicyStatus getStatus() { return status; }
    public PolicyStatus getCancellationPreviousStatus() { return cancellationPreviousStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setPolicyNumber(String v) { policyNumber = v; }
    public void setUser(User v) { user = v; }
    public void setPlan(InsurancePlan v) { plan = v; }
    public void setPremium(BigDecimal v) { premium = v; }
    public void setCoverageAmount(BigDecimal v) { coverageAmount = v; }
    public void setDurationYears(Integer v) { durationYears = v; }
    public void setAge(Integer v) { age = v; }
    public void setRiskCategory(String v) { riskCategory = v; }
    public void setStartDate(LocalDate v) { startDate = v; }
    public void setExpiryDate(LocalDate v) { expiryDate = v; }
    public void setStatus(PolicyStatus v) { status = v; }
    public void setCancellationPreviousStatus(PolicyStatus v) { cancellationPreviousStatus = v; }
}
