package track.expense.splendid_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.*;
import track.expense.splendid_backend.service.AdminService;
import track.expense.splendid_backend.service.SubscriptionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final SubscriptionService subscriptionService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.<AdminStatsDto>builder()
                .success(true)
                .message("Stats fetched successfully")
                .data(adminService.getStats())
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.<List<AdminUserDto>>builder()
                .success(true)
                .message("Users fetched successfully")
                .data(adminService.getAllUsers())
                .build());
    }

    @PutMapping("/users/{id}/toggle-verification")
    public ResponseEntity<ApiResponse<Void>> toggleVerification(@PathVariable Long id) {
        adminService.toggleUserVerification(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User verification status updated")
                .build());
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<TransactionDto>> getAllTransactions(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllTransactions(page, size));
    }


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
}