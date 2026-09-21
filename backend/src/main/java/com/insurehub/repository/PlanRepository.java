package com.insurehub.repository;
import com.insurehub.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PlanRepository extends JpaRepository<InsurancePlan, Long> {
    List<InsurancePlan> findByStatusOrderByName(PlanStatus status);
}
