package com.insurehub.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "policy_id") private Policy policy;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(nullable = false) private String gateway = "MOCK";
    private String gatewayOrderId;
    private String transactionId;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private PaymentStatus status = PaymentStatus.PENDING;
    @Column(nullable = false) private LocalDateTime paymentDate = LocalDateTime.now();
    public Long getId() { return id; }
    public Policy getPolicy() { return policy; }
    public BigDecimal getAmount() { return amount; }
    public String getGateway() { return gateway; }
    public String getGatewayOrderId() { return gatewayOrderId; }
    public String getTransactionId() { return transactionId; }
    public PaymentStatus getStatus() { return status; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPolicy(Policy v) { policy = v; }
    public void setAmount(BigDecimal v) { amount = v; }
    public void setGateway(String v) { gateway = v; }
    public void setGatewayOrderId(String v) { gatewayOrderId = v; }
    public void setTransactionId(String v) { transactionId = v; }
    public void setStatus(PaymentStatus v) { status = v; }
    public void setPaymentDate(LocalDateTime v) { paymentDate = v; }
}
