package com.insurehub.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims", uniqueConstraints = @UniqueConstraint(name = "uk_claim_number", columnNames = "claim_number"))
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "claim_number", nullable = false, unique = true)
    private String claimNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String claimType;

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal claimAmount;

    @Column(nullable = false)
    private LocalDate incidentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.PENDING;

    @Column(length = 2000)
    private String adminRemarks;

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

    public String getClaimNumber() {
        return claimNumber;
    }

    public Policy getPolicy() {
        return policy;
    }

    public User getUser() {
        return user;
    }

    public String getClaimType() {
        return claimType;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getClaimAmount() {
        return claimAmount;
    }

    public LocalDate getIncidentDate() {
        return incidentDate;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setClaimType(String claimType) {
        this.claimType = claimType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setClaimAmount(BigDecimal claimAmount) {
        this.claimAmount = claimAmount;
    }

    public void setIncidentDate(LocalDate incidentDate) {
        this.incidentDate = incidentDate;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}