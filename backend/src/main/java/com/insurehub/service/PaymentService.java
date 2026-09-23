package com.insurehub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurehub.dto.PaymentDtos;
import com.insurehub.dto.QuoteDtos;
import com.insurehub.entity.*;
import com.insurehub.exception.ApiException;
import com.insurehub.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class PaymentService {

  private final PolicyService policyService;
  private final PremiumService premium;
  private final PaymentRepository payments;
  private final ObjectMapper mapper = new ObjectMapper();

  private final String mode;
  private final String keyId;
  private final String keySecret;
  private final String currency;

  private final HttpClient http = HttpClient.newHttpClient();

  public PaymentService(
      PolicyService ps,
      PremiumService premium,
      PaymentRepository payments,
      @Value("${app.payment.mode:mock}") String mode,
      @Value("${app.payment.razorpay-key-id:}") String keyId,
      @Value("${app.payment.razorpay-key-secret:}") String keySecret,
      @Value("${app.payment.currency:INR}") String currency) {
    this.policyService = ps;
    this.premium = premium;
    this.payments = payments;
    this.mode = mode;
    this.keyId = keyId;
    this.keySecret = keySecret;
    this.currency = currency;
  }

  @Transactional
  public PaymentDtos.OrderResponse createOrder(
      String email,
      PaymentDtos.OrderRequest req) {

    Policy p = policyService.getEntity(
        req.policyId(),
        email,
        false);

    Payment pay = payments
        .findFirstByPolicyIdOrderByPaymentDateDesc(
            p.getId())
        .orElseGet(() -> {
          Payment x = new Payment();
          x.setPolicy(p);
          x.setAmount(p.getPremium());
          return payments.save(x);
        });

    if ("razorpay".equalsIgnoreCase(mode)) {

      if (keyId.isBlank() || keySecret.isBlank()) {
        throw new ApiException(
            HttpStatus.SERVICE_UNAVAILABLE,
            "PAYMENT_NOT_CONFIGURED",
            "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env before using Razorpay.");
      }

      try {

        String json = "{\"amount\":" +
            p.getPremium()
                .multiply(BigDecimal.valueOf(100))
                .longValue()
            +
            ",\"currency\":\"" +
            currency +
            "\",\"receipt\":\"" +
            p.getPolicyNumber() +
            "\"}";

        String auth = Base64.getEncoder()
            .encodeToString(
                (keyId + ":" + keySecret)
                    .getBytes(
                        StandardCharsets.UTF_8));

        HttpRequest httpReq = HttpRequest.newBuilder(
            URI.create(
                "https://api.razorpay.com/v1/orders"))
            .header(
                "Content-Type",
                "application/json")
            .header(
                "Authorization",
                "Basic " + auth)
            .POST(
                HttpRequest.BodyPublishers.ofString(
                    json))
            .build();

        HttpResponse<String> resp = http.send(
            httpReq,
            HttpResponse.BodyHandlers.ofString());

        if (resp.statusCode() / 100 != 2) {
          throw new ApiException(
              HttpStatus.BAD_GATEWAY,
              "PAYMENT_PROVIDER_ERROR",
              "Razorpay order creation failed.");
        }

        JsonNode node = mapper.readTree(resp.body());

        String orderId = node.path("id").asText();

        pay.setGateway("RAZORPAY");
        pay.setGatewayOrderId(orderId);
        pay.setStatus(PaymentStatus.PENDING);

        payments.save(pay);

        return new PaymentDtos.OrderResponse(
            p.getId(),
            p.getPremium(),
            currency,
            "razorpay",
            orderId,
            keyId,
            p.getPolicyNumber());

      } catch (ApiException e) {
        throw e;
      } catch (Exception e) {
        throw new ApiException(
            HttpStatus.BAD_GATEWAY,
            "PAYMENT_PROVIDER_ERROR",
            "Unable to reach Razorpay: " + e.getMessage());
      }
    }

    String tx = "MOCK-" +
        UUID.randomUUID()
            .toString()
            .replace("-", "")
            .substring(0, 12)
            .toUpperCase();

    pay.setGateway("MOCK");
    pay.setTransactionId(tx);
    pay.setStatus(PaymentStatus.PENDING);

    payments.save(pay);

    return new PaymentDtos.OrderResponse(
        p.getId(),
        p.getPremium(),
        currency,
        "mock",
        tx,
        "",
        tx);
  }

  /*
   * Creates a NEW payment order specifically for renewal.
   * This prevents the renewal from charging the old purchase amount.
   */
  @Transactional
  public PaymentDtos.OrderResponse createRenewalOrder(
      String email,
      Long policyId) {

    Policy p = policyService.getEntity(
        policyId,
        email,
        false);

    QuoteDtos.QuoteRequest request = new QuoteDtos.QuoteRequest(
        p.getPlan().getId(),
        p.getAge(),
        p.getCoverageAmount(),
        p.getDurationYears(),
        p.getRiskCategory());

    QuoteDtos.QuoteResponse quote = premium.calculate(
        p.getUser(),
        request);

    BigDecimal renewalPremium = quote.finalPremium();

    Payment pay = new Payment();
    pay.setPolicy(p);
    pay.setAmount(renewalPremium);

    if ("razorpay".equalsIgnoreCase(mode)) {

      if (keyId.isBlank() || keySecret.isBlank()) {
        throw new ApiException(
            HttpStatus.SERVICE_UNAVAILABLE,
            "PAYMENT_NOT_CONFIGURED",
            "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env before using Razorpay.");
      }

      try {

        String json = "{\"amount\":" +
            renewalPremium
                .multiply(BigDecimal.valueOf(100))
                .longValue()
            +
            ",\"currency\":\"" +
            currency +
            "\",\"receipt\":\"" +
            p.getPolicyNumber() +
            "-RENEWAL\"}";

        String auth = Base64.getEncoder()
            .encodeToString(
                (keyId + ":" + keySecret)
                    .getBytes(
                        StandardCharsets.UTF_8));

        HttpRequest httpReq = HttpRequest.newBuilder(
            URI.create(
                "https://api.razorpay.com/v1/orders"))
            .header(
                "Content-Type",
                "application/json")
            .header(
                "Authorization",
                "Basic " + auth)
            .POST(
                HttpRequest.BodyPublishers.ofString(
                    json))
            .build();

        HttpResponse<String> resp = http.send(
            httpReq,
            HttpResponse.BodyHandlers.ofString());

        if (resp.statusCode() / 100 != 2) {
          throw new ApiException(
              HttpStatus.BAD_GATEWAY,
              "PAYMENT_PROVIDER_ERROR",
              "Razorpay order creation failed.");
        }

        JsonNode node = mapper.readTree(resp.body());

        String orderId = node.path("id").asText();

        pay.setGateway("RAZORPAY");
        pay.setGatewayOrderId(orderId);
        pay.setStatus(PaymentStatus.PENDING);

        payments.save(pay);

        return new PaymentDtos.OrderResponse(
            p.getId(),
            renewalPremium,
            currency,
            "razorpay",
            orderId,
            keyId,
            p.getPolicyNumber());

      } catch (ApiException e) {
        throw e;
      } catch (Exception e) {
        throw new ApiException(
            HttpStatus.BAD_GATEWAY,
            "PAYMENT_PROVIDER_ERROR",
            "Unable to reach Razorpay: " + e.getMessage());
      }
    }

    String tx = "MOCK-" +
        UUID.randomUUID()
            .toString()
            .replace("-", "")
            .substring(0, 12)
            .toUpperCase();

    pay.setGateway("MOCK");
    pay.setTransactionId(tx);
    pay.setStatus(PaymentStatus.PENDING);

    payments.save(pay);

    return new PaymentDtos.OrderResponse(
        p.getId(),
        renewalPremium,
        currency,
        "mock",
        tx,
        "",
        tx);
  }

  @Transactional
  public PaymentDtos.PaymentResponse verify(
      String email,
      PaymentDtos.VerifyRequest req) {

    Policy p = policyService.getEntity(
        req.policyId(),
        email,
        false);

    Payment pay = payments
        .findByPolicyIdOrderByPaymentDateDesc(p.getId())
        .stream()
        .filter(payment -> {
          if ("mock".equalsIgnoreCase(mode)) {
            return req.paymentId() != null
                && req.paymentId().equals(payment.getTransactionId());
          }

          return req.orderId() != null
              && req.orderId().equals(payment.getGatewayOrderId());
        })
        .findFirst()
        .orElseThrow(
            () -> new ApiException(
                HttpStatus.NOT_FOUND,
                "PAYMENT_NOT_FOUND",
                "Payment order not found."));

    boolean mock = "mock".equalsIgnoreCase(mode);

    if (mock) {

      pay.setStatus(
          PaymentStatus.MOCK_PAID);

      pay.setTransactionId(
          req.paymentId());

    } else {

      if (!req.orderId().equals(
          pay.getGatewayOrderId())) {

        throw new ApiException(
            HttpStatus.BAD_REQUEST,
            "INVALID_PAYMENT_ORDER",
            "Payment order does not match the policy.");
      }

      if (!verifySignature(
          req.orderId() + "|" + req.paymentId(),
          req.signature())) {

        pay.setStatus(
            PaymentStatus.FAILED);

        payments.save(pay);

        throw new ApiException(
            HttpStatus.BAD_REQUEST,
            "INVALID_PAYMENT_SIGNATURE",
            "Razorpay signature verification failed.");
      }

      pay.setStatus(
          PaymentStatus.PAID);

      pay.setTransactionId(
          req.paymentId());
    }

    pay.setPaymentDate(
        LocalDateTime.now());

    payments.save(pay);

    policyService.addHistory(
        p,
        "PAYMENT_SUCCESS",
        "Premium payment recorded: " +
            pay.getTransactionId(),
        email);

    return map(pay);
  }

  @Transactional(readOnly = true)
  public java.util.List<PaymentDtos.PaymentResponse> forPolicy(
      Long policyId,
      String email,
      boolean admin) {

    policyService.getEntity(
        policyId,
        email,
        admin);

    return payments
        .findByPolicyIdOrderByPaymentDateDesc(
            policyId)
        .stream()
        .map(this::map)
        .toList();
  }

  private boolean verifySignature(
      String payload,
      String signature) {

    try {

      Mac mac = Mac.getInstance("HmacSHA256");

      mac.init(
          new SecretKeySpec(
              keySecret.getBytes(
                  StandardCharsets.UTF_8),
              "HmacSHA256"));

      byte[] out = mac.doFinal(
          payload.getBytes(
              StandardCharsets.UTF_8));

      String expected = java.util.HexFormat
          .of()
          .formatHex(out);

      return expected.equalsIgnoreCase(
          signature);

    } catch (Exception e) {
      return false;
    }
  }

  private PaymentDtos.PaymentResponse map(
      Payment p) {

    return new PaymentDtos.PaymentResponse(
        p.getId(),
        p.getPolicy().getId(),
        p.getAmount(),
        p.getGateway(),
        p.getGatewayOrderId(),
        p.getTransactionId(),
        p.getStatus(),
        p.getPaymentDate());
  }
}