package com.insurehub.service;

import com.insurehub.dto.AdminDtos;
import com.insurehub.dto.PolicyDtos;
import com.insurehub.dto.UserResponse;
import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import com.insurehub.entity.Role;
import com.insurehub.repository.PlanRepository;
import com.insurehub.repository.PolicyRepository;
import com.insurehub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

  private final UserRepository users;
  private final PlanRepository plans;
  private final PolicyRepository policies;
  private final PolicyService policyService;

  public AdminService(
      UserRepository users,
      PlanRepository plans,
      PolicyRepository policies,
      PolicyService policyService) {
    this.users = users;
    this.plans = plans;
    this.policies = policies;
    this.policyService = policyService;
  }

  public AdminDtos.StatsResponse stats() {

    long active = policies.countByStatus(
        PolicyStatus.ACTIVE)
        +
        policies.countByStatus(
            PolicyStatus.RENEWED);

    long due = policies.findAll()
        .stream()
        .filter(p -> p.getStatus() != PolicyStatus.CANCELLED
            &&
            !p.getExpiryDate()
                .isBefore(
                    LocalDate.now())
            &&
            !p.getExpiryDate()
                .isAfter(
                    LocalDate.now()
                        .plusDays(30)))
        .count();

    BigDecimal coverage = policies.findAll()
        .stream()
        .filter(p -> p.getStatus() != PolicyStatus.CANCELLED)
        .map(
            Policy::getCoverageAmount)
        .reduce(
            BigDecimal.ZERO,
            BigDecimal::add);

    return new AdminDtos.StatsResponse(
        users.findAll()
            .stream()
            .filter(u -> u.getRole() == Role.CUSTOMER)
            .count(),

        plans.count(),

        policies.count(),

        active,

        due,

        policies.countByStatus(
            PolicyStatus.CANCEL_REQUESTED),

        coverage);
  }

  public List<UserResponse> users() {

    return users.findAll()
        .stream()
        .filter(user -> user.getRole() == Role.CUSTOMER)
        .map(AuthService::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<PolicyDtos.PolicyResponse> policies() {

    return policies.findAll()
        .stream()
        .map(
            policyService::map)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<AdminDtos.CancellationResponse> cancellationRequests() {

    return policies
        .findByStatusOrderByUpdatedAtDesc(
            PolicyStatus.CANCEL_REQUESTED)
        .stream()
        .map(p -> new AdminDtos.CancellationResponse(
            p.getId(),
            p.getPolicyNumber(),
            p.getUser().getName(),
            p.getUser().getEmail(),
            p.getPlan().getName(),
            p.getStatus().name(),
            p.getUpdatedAt().toString()))
        .toList();
  }
}