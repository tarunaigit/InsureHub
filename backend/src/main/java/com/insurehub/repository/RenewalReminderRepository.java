package com.insurehub.repository;

import com.insurehub.entity.RenewalReminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RenewalReminderRepository
        extends JpaRepository<RenewalReminder, Long> {

    List<RenewalReminder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<RenewalReminder> findAllByOrderByCreatedAtDesc();

    boolean existsByPolicyIdAndSentAtBetween(
            Long policyId,
            LocalDateTime start,
            LocalDateTime end
    );
}