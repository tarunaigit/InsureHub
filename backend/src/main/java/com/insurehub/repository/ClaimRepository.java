package com.insurehub.repository;

import com.insurehub.entity.Claim;
import com.insurehub.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository
        extends JpaRepository<Claim, Long> {

    List<Claim> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<Claim> findAllByOrderByCreatedAtDesc();

    List<Claim> findByStatusOrderByCreatedAtDesc(
            ClaimStatus status
    );
}