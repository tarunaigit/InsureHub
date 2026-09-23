package com.insurehub.controller;

import com.insurehub.dto.PaymentDtos;
import com.insurehub.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

        private final PaymentService service;

        public PaymentController(PaymentService service) {
                this.service = service;
        }

        @PostMapping("/order")
        public PaymentDtos.OrderResponse order(
                        Authentication a,
                        @Valid @RequestBody PaymentDtos.OrderRequest r) {
                return service.createOrder(
                                a.getName(),
                                r);
        }

        @PostMapping("/renewal-order")
        public PaymentDtos.OrderResponse renewalOrder(
                        Authentication a,
                        @RequestParam Long policyId) {
                return service.createRenewalOrder(
                                a.getName(),
                                policyId);
        }

        @PostMapping("/verify")
        public PaymentDtos.PaymentResponse verify(
                        Authentication a,
                        @Valid @RequestBody PaymentDtos.VerifyRequest r) {
                return service.verify(
                                a.getName(),
                                r);
        }

        @GetMapping("/policy/{policyId}")
        public java.util.List<PaymentDtos.PaymentResponse> forPolicy(
                        Authentication a,
                        @PathVariable Long policyId) {

                boolean admin = a.getAuthorities()
                                .stream()
                                .anyMatch(
                                                x -> x.getAuthority()
                                                                .equals("ROLE_ADMIN"));

                return service.forPolicy(
                                policyId,
                                a.getName(),
                                admin);
        }
}