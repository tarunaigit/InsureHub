package com.insurehub.service;

import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import com.insurehub.repository.PolicyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class RenewalReminderScheduler {

    private final PolicyService policyService;
    private final PolicyRepository policyRepository;
    private final RenewalReminderService reminderService;

    public RenewalReminderScheduler(
            PolicyRepository policyRepository,
            RenewalReminderService reminderService,
            PolicyService policyService) {

        this.policyRepository = policyRepository;
        this.reminderService = reminderService;
        this.policyService = policyService;
    }

    /**
     * Runs every day at 9:00 AM.
     *
     * The server checks policies whose expiry date is
     * exactly one month from today.
     */
    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void sendRenewalReminders() {
        policyService.expirePolicies();

        LocalDate today = LocalDate.now();

        LocalDate targetExpiry = today.plusMonths(1);

        List<Policy> policies = policyRepository
                .findByStatusInAndExpiryDate(
                        List.of(
                                PolicyStatus.ACTIVE,
                                PolicyStatus.RENEWED),
                        targetExpiry);

        for (Policy policy : policies) {

            try {
                reminderService.sendAutomaticReminder(
                        policy);
            } catch (Exception e) {

                /*
                 * One failed email must not prevent
                 * other customers from receiving
                 * their reminders.
                 */
                System.err.println(
                        "Failed to send renewal reminder for policy "
                                + policy.getPolicyNumber()
                                + ": "
                                + e.getMessage());
            }
        }
    }
}