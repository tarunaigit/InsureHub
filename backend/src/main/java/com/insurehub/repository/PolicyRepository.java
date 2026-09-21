package com.insurehub.repository;

import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByPolicyNumber(
            String policyNumber
    );

    List<Policy> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<Policy> findByStatusInAndExpiryDate(
            List<PolicyStatus> statuses,
            LocalDate expiryDate
    );

    List<Policy> findByStatusInAndExpiryDateBefore(
            List<PolicyStatus> statuses,
            LocalDate date
    );

    boolean existsByPolicyNumber(
            String policyNumber
    );

    long countByStatus(
            PolicyStatus status
    );

    long countByUserId(
            Long userId
    );

    List<Policy> findByStatusOrderByUpdatedAtDesc(
            PolicyStatus status
    );
}