package com.insurehub.service;

import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import com.insurehub.entity.RenewalReminder;
import com.insurehub.repository.RenewalReminderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RenewalReminderService {

        private final RenewalReminderRepository reminders;
        private final EmailService emailService;
        private final PolicyService policyService;

        public RenewalReminderService(
                        RenewalReminderRepository reminders,
                        EmailService emailService,
                        PolicyService policyService) {
                this.reminders = reminders;
                this.emailService = emailService;
                this.policyService = policyService;
        }

        /**
         * Automatically sends the renewal email for a policy.
         *
         * This method is called by the scheduler.
         */
        @Transactional
        public void sendAutomaticReminder(Policy policy) {

                if (policy == null) {
                        return;
                }

                if (policy.getExpiryDate() == null) {
                        return;
                }

                if (policy.getStatus() == PolicyStatus.CANCELLED) {
                        return;
                }

                LocalDate today = LocalDate.now();

                /*
                 * Reminder date is exactly one month before expiry.
                 */
                LocalDate reminderDate = policy.getExpiryDate().minusMonths(1);

                if (!today.equals(reminderDate)) {
                        return;
                }

                LocalDateTime startOfDay = today.atStartOfDay();

                LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

                /*
                 * Prevent duplicate emails if the scheduler
                 * runs more than once.
                 */
                if (reminders.existsByPolicyIdAndSentAtBetween(
                                policy.getId(),
                                startOfDay,
                                endOfDay)) {
                        return;
                }

                String recipientEmail = policy.getUser().getEmail();

                String customerName = policy.getUser().getName();

                String policyNumber = policy.getPolicyNumber();

                String planName = policy.getPlan().getName();

                String expiryDate = policy.getExpiryDate().toString();

                /*
                 * Send the real email first.
                 *
                 * If sending fails, an exception is thrown and
                 * no successful reminder record is created.
                 */
                emailService.sendRenewalReminder(
                                recipientEmail,
                                customerName,
                                policyNumber,
                                planName,
                                expiryDate);

                /*
                 * Save the successful email in the database.
                 */
                RenewalReminder reminder = new RenewalReminder();

                reminder.setPolicy(policy);
                reminder.setUser(policy.getUser());

                reminder.setRecipientEmail(
                                recipientEmail);

                reminder.setSubject(
                                "Your InsureHub policy is due for renewal");

                reminder.setMessage(
                                "Renewal reminder sent automatically to "
                                                + recipientEmail
                                                + " for policy "
                                                + policyNumber
                                                + ". Policy expires on "
                                                + expiryDate
                                                + ".");

                reminder.setStatus(
                                com.insurehub.entity.ReminderStatus.SENT);

                reminder.setSentAt(
                                LocalDateTime.now());

                reminders.save(reminder);

                policyService.addHistory(
                                policy,
                                "RENEWAL_REMINDER",
                                "Automatic renewal reminder email sent to "
                                                + recipientEmail
                                                + ".",
                                "SYSTEM");
        }

        @Transactional(readOnly = true)
        public List<com.insurehub.dto.ReminderDtos.ReminderResponse> mine(
                        String email) {
                var user = policyService.user(email);

                return reminders
                                .findByUserIdOrderByCreatedAtDesc(user.getId())
                                .stream()
                                .map(this::map)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<com.insurehub.dto.ReminderDtos.ReminderResponse> all() {

                return reminders
                                .findAllByOrderByCreatedAtDesc()
                                .stream()
                                .map(this::map)
                                .toList();
        }

        private com.insurehub.dto.ReminderDtos.ReminderResponse map(
                        RenewalReminder reminder) {
                return new com.insurehub.dto.ReminderDtos.ReminderResponse(
                                reminder.getId(),
                                reminder.getPolicy().getId(),
                                reminder.getPolicy().getPolicyNumber(),
                                reminder.getRecipientEmail(),
                                reminder.getSubject(),
                                reminder.getMessage(),
                                reminder.getStatus(),
                                reminder.getSentAt(),
                                reminder.getCreatedAt());
        }
}