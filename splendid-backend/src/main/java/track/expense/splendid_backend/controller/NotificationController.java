package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.dto.BroadcastRequestDto;
import track.expense.splendid_backend.dto.NotificationResponseDto;
import track.expense.splendid_backend.service.NotificationService;

import java.util.List;
import java.util.Map;

@Tag(name = "Notifications", description = "Endpoints for user notifications and system broadcasts")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get current user notifications")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponseDto>>> getUserNotifications() {
        List<NotificationResponseDto> notifications = notificationService.getUserNotifications();
        return ResponseEntity.ok(ApiResponse.<List<NotificationResponseDto>>builder()
                .success(true)
                .message("Notifications fetched successfully")
                .data(notifications)
                .build());
    }

    @Operation(summary = "Get unread notification count")
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .success(true)
                .message("Unread notification count fetched")
                .data(Map.of("unreadCount", count))
                .build());
    }

    @Operation(summary = "Mark single notification as read")
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Notification marked as read")
                .build());
    }

    @Operation(summary = "Mark all notifications as read")
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("All notifications marked as read")
                .build());
    }

    @Operation(summary = "Send broadcast notification to all users (Admin only)")
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> sendBroadcast(@Valid @RequestBody BroadcastRequestDto request) {
        notificationService.sendBroadcast(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Broadcast notification sent successfully")
                .build());
    }
}
