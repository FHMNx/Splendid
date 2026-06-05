package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.*;
import track.expense.splendid_backend.service.UserService;

import java.util.Map;

@Tag(name = "Authentication", description = "User registration, login, email verification and password reset")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @Operation(summary = "Register a new user", description = "Creates account and sends verification email")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequestDto request) {
        userService.register(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Registration successful. Please check your email to verify your account.")
                .build()
        );
    }

    @Operation(summary = "Login", description = "Returns JWT token on successful login")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@RequestBody LoginRequestDto request) {
        AuthResponseDto response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponseDto>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build()
        );
    }

    @Operation(summary = "Verify email", description = "Verifies email using token from verification email")
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        String message = userService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .build()
        );
    }

    @Operation(summary = "Resend verification email")
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<String>> resendVerification(@RequestParam String email) {
        String message = userService.resendVerification(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .build()
        );
    }

    @Operation(summary = "Request password reset", description = "Sends reset link to email (15 min expiry)")
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("password reset email sent successfully")
                .build()
        );
    }

    @Operation(summary = "Reset password using token")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam String token,
                                                             @RequestParam String password) {
        userService.resetPassword(token, password);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Password reset successful")
                .build()
        );
    }

    @Operation(summary = "Validate password reset token")
    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse<String>> validateResetToken(@RequestParam String token) {
        userService.validateResetToken(token);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Valid token")
                .build()
        );
    }


    @Operation(summary = "Get current user profile")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile() {
        UserProfileDto profile = userService.getProfile();
        return ResponseEntity.ok(ApiResponse.<UserProfileDto>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(profile)
                .build()
        );
    }

    @Operation(summary = "Update profile name")
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(@RequestBody UpdateProfileDto request) {
        UserProfileDto updated = userService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.<UserProfileDto>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(updated)
                .build()
        );
    }

    @Operation(summary = "Change password")
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordDto request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully")
                .build()
        );
    }


    @Operation(summary = "Update profile image", description = "Upload base64 encoded image to Cloudinary")
    @PutMapping("/profile/image")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfileImage(@RequestBody Map<String, String> body) {

        String base64Image = body.get("profileImageUrl");
        if (base64Image == null || base64Image.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.<UserProfileDto>builder()
                    .success(false)
                    .message("Image data is required")
                    .build()
            );
        }

        UserProfileDto updated = userService.updateProfileImage(base64Image);
        return ResponseEntity.ok(ApiResponse.<UserProfileDto>builder()
                .success(true)
                .message("Profile image updated successfully")
                .data(updated)
                .build()
        );
    }
}