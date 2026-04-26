package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.AuthResponseDto;
import track.expense.splendid_backend.dto.LoginRequestDto;
import track.expense.splendid_backend.dto.RegisterRequestDto;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.EmailService;
import track.expense.splendid_backend.service.UserService;
import track.expense.splendid_backend.security.jwt.JwtService;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Override
    public void register(RegisterRequestDto request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String token = UUID.randomUUID().toString();

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .isVerified(false)
                .verificationToken(token)
                .tokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        userRepository.save(user);

        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFirstName(),
                token
        );
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Email or password");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponseDto.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();

    }

    @Override
    public void requestPasswordReset(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        user.setResetPasswordToken(token);
        user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        emailService.sendPasswordResetEmail(
                user.getEmail(),
                user.getFirstName(),
                token
        );
    }

    @Override
    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetPasswordExpiry() == null ||
                user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Reset token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);

        userRepository.save(user);
    }
}
