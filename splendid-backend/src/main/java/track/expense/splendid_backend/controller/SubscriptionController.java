package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.dto.SubscriptionDto;
import track.expense.splendid_backend.service.SubscriptionService;

@Tag(name = "Subscription", description = "Check user subscription status")
@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Operation(summary = "Get subscription status", description = "Returns plan, status, days remaining and isActive flag")
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<SubscriptionDto>> getStatus() {
        SubscriptionDto dto = subscriptionService.getSubscriptionStatus();
        return ResponseEntity.ok(
                ApiResponse.<SubscriptionDto>builder()
                        .success(true)
                        .message("Subscription status fetched")
                        .data(dto)
                        .build()
        );
    }
}