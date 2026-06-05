package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.*;
import track.expense.splendid_backend.repository.PaymentRepository;
import track.expense.splendid_backend.dto.PageResponse;
import track.expense.splendid_backend.service.AdminService;
import track.expense.splendid_backend.service.SubscriptionService;
import track.expense.splendid_backend.dto.PaymentDto;
import track.expense.splendid_backend.dto.PaymentSummaryDto;
import track.expense.splendid_backend.dto.RecordPaymentDto;

import java.util.List;
import java.util.Map;

@Tag(name = "Admin", description = "Admin-only endpoints for platform management. Requires ADMIN role.")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final SubscriptionService subscriptionService;

    @Operation(summary = "Get platform statistics")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.<AdminStatsDto>builder()
                .success(true)
                .message("Stats fetched successfully")
                .data(adminService.getStats())
                .build());
    }

    @Operation(summary = "Get all users with subscription info")
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.<List<AdminUserDto>>builder()
                .success(true)
                .message("Users fetched successfully")
                .data(adminService.getAllUsers())
                .build());
    }

    @Operation(summary = "Toggle user email verification status")
    @PutMapping("/users/{id}/toggle-verification")
    public ResponseEntity<ApiResponse<Void>> toggleVerification(@PathVariable Long id) {
        adminService.toggleUserVerification(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User verification status updated")
                .build());
    }

    @Operation(summary = "Get all transactions across all users (paginated)")
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<PageResponse<TransactionDto>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TransactionDto> pageData = adminService.getAllTransactions(page, size);

        PageResponse<TransactionDto> pageResponse = PageResponse.<TransactionDto>builder()
                .content(pageData.getContent())
                .pageNumber(pageData.getNumber())
                .pageSize(pageData.getSize())
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .isLast(pageData.isLast())
                .hasNext(pageData.hasNext())
                .build();

        return ResponseEntity.ok(ApiResponse.<PageResponse<TransactionDto>>builder()
                .success(true)
                .message("All platform transactions fetched successfully")
                .data(pageResponse)
                .build());
    }

    @Operation(summary = "Activate or upgrade user subscription")
    @PutMapping("/users/{id}/subscription")
    public ResponseEntity<ApiResponse<SubscriptionDto>> activateSubscription(@PathVariable Long id, @RequestBody Map<String, String> body) {

        String plan = body.get("plan");
        SubscriptionDto dto = subscriptionService.activatePlan(id, plan);

        return ResponseEntity.ok(ApiResponse.<SubscriptionDto>builder()
                .success(true)
                .message("Subscription activated successfully")
                .data(dto)
                .build()
        );
    }

    @Operation(summary = "Get all payment records")
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<PaymentDto>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.<List<PaymentDto>>builder()
                .success(true)
                .message("Payments fetched")
                .data(adminService.getAllPayments())
                .build());
    }

    @Operation(summary = "Get platform revenue summary")
    @GetMapping("/payments/summary")
    public ResponseEntity<ApiResponse<PaymentSummaryDto>> getPaymentSummary() {
        return ResponseEntity.ok(ApiResponse.<PaymentSummaryDto>builder()
                .success(true)
                .message("Summary fetched")
                .data(adminService.getPaymentSummary())
                .build());
    }

    @Operation(summary = "Record a manual payment", description = "Used when user pays via WhatsApp. Also activates their subscription.")
    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<PaymentDto>> recordPayment(@RequestBody RecordPaymentDto request) {
        PaymentDto payment = adminService.recordPayment(request);
        return ResponseEntity.ok(ApiResponse.<PaymentDto>builder()
                .success(true)
                .message("Payment recorded and subscription activated")
                .data(payment)
                .build());
    }


}