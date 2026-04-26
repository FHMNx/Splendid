package track.expense.splendid_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.AuthResponseDto;
import track.expense.splendid_backend.dto.LoginRequestDto;
import track.expense.splendid_backend.dto.RegisterRequestDto;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.EmailService;
import track.expense.splendid_backend.service.UserService;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto request) {
        userService.register(request);
        return ResponseEntity.ok("Registration successful. Please check your email to verify your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {
        AuthResponseDto response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public String verifyEmail(@RequestParam String token) {

        User user = userRepository.findByVerificationToken(token).orElse(null);

        if (user == null) {
            return "Invalid verification link.";
        }

        if (user.isVerified()) {
            return "Email already verified.";
        }

        if (user.getTokenExpiry() == null ||
                user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            return "Verification link expired. Please request a new one.";
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);

        userRepository.save(user);

        return "Congratulations! Your email has been verified successfully";
    }


    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam String email) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Email already verified");
        }

        if (user.getTokenExpiry() != null &&
                user.getTokenExpiry().isAfter(LocalDateTime.now().minusMinutes(2))) {

            return ResponseEntity.badRequest().body("Please wait before requesting another verification email.");
        }

        String newToken = UUID.randomUUID().toString();

        user.setVerificationToken(newToken);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), newToken);
        return ResponseEntity.ok("Verification email resent successfully");
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok("Password reset email sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String password) {
        userService.resetPassword(token, password);
        return ResponseEntity.ok("Password reset successful");
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<String> validateResetToken(@RequestParam String token) {

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetPasswordExpiry() == null ||
                user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expired");
        }

        return ResponseEntity.ok("Valid token");
    }
}
