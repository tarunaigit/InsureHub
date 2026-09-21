package com.insurehub.controller;

import com.insurehub.dto.AdminDtos;
import com.insurehub.dto.PlanDtos;
import com.insurehub.dto.PolicyDtos;
import com.insurehub.dto.UserResponse;
import com.insurehub.service.AdminService;
import com.insurehub.service.CancellationService;
import com.insurehub.service.PlanService;

import com.insurehub.dto.ClaimDtos;
import com.insurehub.service.ClaimService;

import com.insurehub.dto.ReminderDtos;
import com.insurehub.service.RenewalReminderService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService admin;
    private final CancellationService cancellations;
    private final PlanService plans;
    private final ClaimService claimService;
    private final RenewalReminderService reminders;

    public AdminController(
            AdminService admin,
            CancellationService cancellations,
            PlanService plans,
            ClaimService claimService,
            RenewalReminderService reminders) {
        this.admin = admin;
        this.cancellations = cancellations;
        this.plans = plans;
        this.claimService = claimService;
        this.reminders = reminders;
    }

    @GetMapping("/stats")
    public AdminDtos.StatsResponse stats() {
        return admin.stats();
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return admin.users();
    }

    @GetMapping("/policies")
    public List<PolicyDtos.PolicyResponse> policies() {
        return admin.policies();
    }

    @GetMapping("/cancellation-requests")
    public List<AdminDtos.CancellationResponse> requests() {

        return admin.cancellationRequests();
    }

    @PutMapping("/cancellation-requests/{id}/approve")
    public PolicyDtos.PolicyResponse approve(
            Authentication authentication,
            @PathVariable Long id) {

        return cancellations.approve(
                id,
                authentication.getName());
    }

    @PutMapping("/cancellation-requests/{id}/reject")
    public PolicyDtos.PolicyResponse reject(
            Authentication authentication,
            @PathVariable Long id) {

        return cancellations.reject(
                id,
                authentication.getName());
    }

    @PutMapping("/claims/{id}/status")
    public ClaimDtos.ClaimResponse updateClaim(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ClaimDtos.UpdateClaimRequest request) {

        return claimService.updateStatus(
                id,
                request,
                authentication.getName());
    }

    @GetMapping("/plans")
    public List<PlanDtos.PlanResponse> allPlans() {
        return plans.all();
    }

    @GetMapping("/claims")
    public List<ClaimDtos.ClaimResponse> claims() {
        return claimService.all();
    }

    @GetMapping("/reminders")
    public List<ReminderDtos.ReminderResponse> reminders() {
        return reminders.all();
    }

}