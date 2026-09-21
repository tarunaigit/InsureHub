package com.insurehub.repository;
import com.insurehub.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPolicyIdOrderByPaymentDateDesc(Long policyId);
    Optional<Payment> findFirstByPolicyIdOrderByPaymentDateDesc(Long policyId);
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    Optional<Payment> findByTransactionId(String transactionId);
}
