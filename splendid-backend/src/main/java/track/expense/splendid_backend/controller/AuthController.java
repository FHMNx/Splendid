package track.expense.splendid_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.AuthResponseDto;
import track.expense.splendid_backend.dto.LoginRequestDto;
import track.expense.splendid_backend.dto.RegisterRequestDto;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto request) {
        userService.register(request);
        return ResponseEntity.ok("Registration successful. Please check your email to verify your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {
        userService.login(request);
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/verify")
    public String verifyEmail(@RequestParam String token) {
        User user = userRepository.findByVerificationToken(token).orElse(null);
        if (user == null) {
            return "Invalid or expired verification link.";
        }

        if (user.isEnabled()) {
            return "Email already verified.";
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return "Congratulations! Your email has been verified successfully";
    }
}
