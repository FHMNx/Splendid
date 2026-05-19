package track.expense.splendid_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.dto.SubscriptionDto;
import track.expense.splendid_backend.service.SubscriptionService;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

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