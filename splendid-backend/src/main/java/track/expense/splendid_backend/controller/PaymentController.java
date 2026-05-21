package track.expense.splendid_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.dto.PayHereNotifyRequest;
import track.expense.splendid_backend.entity.Payment;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.repository.PaymentRepository;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.SubscriptionService;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    // PayHere calls this endpoint after payment
    @PostMapping("/payhere/notify")
    public ResponseEntity<String> handlePayHereNotify(
            @ModelAttribute PayHereNotifyRequest notify) {

        try {
            // verify the hash to confirm request is from PayHere
            String localMd5sig = generateMd5(
                    merchantId +
                            notify.getOrder_id() +
                            notify.getPayhere_amount() +
                            notify.getPayhere_currency() +
                            notify.getStatus_code() +
                            generateMd5(merchantSecret).toUpperCase()
            ).toUpperCase();

            if (!localMd5sig.equals(notify.getMd5sig())) {
                return ResponseEntity.badRequest().body("Invalid signature");
            }

            if (!"2".equals(notify.getStatus_code())) {
                return ResponseEntity.ok("Payment not successful, ignored");
            }

            // Step 3 — activate subscription
            Long userId = Long.parseLong(notify.getCustom_1());
            String plan = notify.getCustom_2();

            subscriptionService.activatePlan(userId, plan);

// Step 4 — auto-save payment record
            User user = userRepository.findById(userId).orElse(null);

            if (user != null) {
                java.math.BigDecimal amount = switch (plan) {
                    case "MONTHLY" -> new java.math.BigDecimal("499.00");
                    case "HALF_YEARLY" -> new java.math.BigDecimal("2499.00");
                    case "YEARLY" -> new java.math.BigDecimal("3999.00");
                    default -> java.math.BigDecimal.ZERO;
                };

                Payment payment = Payment.builder()
                        .user(user)
                        .plan(Payment.Plan.valueOf(plan))
                        .amount(amount)
                        .paymentMethod(Payment.PaymentMethod.PAYHERE)
                        .status(Payment.PaymentStatus.COMPLETED)
                        .orderId(notify.getOrder_id())
                        .paidAt(java.time.LocalDateTime.now())
                        .build();

                paymentRepository.save(payment);
            }

            return ResponseEntity.ok("Subscription activated");

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error processing payment: " + e.getMessage());
        }
    }

    // MD5 hash helper
    private String generateMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            BigInteger number = new BigInteger(1, messageDigest);
            String hashtext = number.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (Exception e) {
            throw new RuntimeException("MD5 generation failed", e);
        }
    }


    @PostMapping("/payhere/hash")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateHash(
            @RequestBody Map<String, String> body) {

        String orderId = body.get("orderId");
        String amount = body.get("amount");
        String currency = body.get("currency");

        // PayHere hash formula:
        // MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
        String merchantSecretHash = generateMd5(merchantSecret).toUpperCase();
        String hash = generateMd5(
                merchantId + orderId + amount + currency + merchantSecretHash
        ).toUpperCase();

        return ResponseEntity.ok(
                ApiResponse.<Map<String, String>>builder()
                        .success(true)
                        .message("Hash generated")
                        .data(Map.of("hash", hash, "merchantId", merchantId))
                        .build()
        );
    }
}