package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.dto.ContactRequestDto;
import track.expense.splendid_backend.dto.UserProfileDto;
import track.expense.splendid_backend.service.EmailService;
import track.expense.splendid_backend.service.UserService;

@Tag(name = "Contact", description = "Authenticated contact and support inquiries")
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final UserService userService;
    private final EmailService emailService;

    @Operation(summary = "Submit contact form", description = "Sends confirmation email to user and notification email to support")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitContact(@RequestBody ContactRequestDto request) {
        if (request.getSubject() == null || request.getSubject().isBlank()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<Void>builder()
                            .success(false)
                            .message("Subject is required")
                            .build()
            );
        }

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<Void>builder()
                            .success(false)
                            .message("Message is required")
                            .build()
            );
        }

        UserProfileDto userProfile = userService.getProfile();
        String userEmail = userProfile.getEmail();
        String firstName = userProfile.getFirstName() != null ? userProfile.getFirstName() : "";
        String lastName = userProfile.getLastName() != null ? userProfile.getLastName() : "";
        String userName = (firstName + " " + lastName).trim();
        if (userName.isEmpty()) {
            userName = "User";
        }

        // Send confirmation email to the user
        emailService.sendContactConfirmationEmail(userEmail, userName, request.getSubject().trim());

        // Send notification email to the admin/support team
        emailService.sendAdminContactNotification(userEmail, userName, request.getSubject().trim(), request.getMessage().trim());

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Your message has been sent successfully. We will get back to you shortly!")
                        .build()
        );
    }
}
