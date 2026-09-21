package com.insurehub.repository;
import com.insurehub.entity.PolicyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface HistoryRepository extends JpaRepository<PolicyHistory, Long> {
    List<PolicyHistory> findByPolicyIdOrderByTimestampAsc(Long policyId);
}
