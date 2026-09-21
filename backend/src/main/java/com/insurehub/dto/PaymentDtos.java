package com.insurehub.dto;
import com.insurehub.entity.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public final class PaymentDtos {
    private PaymentDtos() {}
    public record OrderRequest(@NotNull Long policyId) {}
    public record OrderResponse(Long policyId, BigDecimal amount, String currency, String mode,
                                String orderId, String keyId, String transactionId) {}
    public record VerifyRequest(@NotNull Long policyId, @NotBlank String orderId,
                                @NotBlank String paymentId, @NotBlank String signature) {}
    public record PaymentResponse(Long id, Long policyId, BigDecimal amount, String gateway,
                                  String orderId, String transactionId, PaymentStatus status, LocalDateTime paymentDate) {}
}
