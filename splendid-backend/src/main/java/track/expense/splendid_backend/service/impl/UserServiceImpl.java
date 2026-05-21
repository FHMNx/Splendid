package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.*;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.entity.UserProfileImage;
import track.expense.splendid_backend.repository.UserProfileImageRepository;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.CloudinaryService;
import track.expense.splendid_backend.service.EmailService;
import track.expense.splendid_backend.service.SubscriptionService;
import track.expense.splendid_backend.service.UserService;
import track.expense.splendid_backend.security.jwt.JwtService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    private final UserProfileImageRepository profileImageRepository;
    private final CloudinaryService cloudinaryService;

    private final SubscriptionService subscriptionService;

    private static final String EMAIL_REGEX = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!#%*?&]{8,}$";

    @Override
    public void register(RegisterRequestDto request) {

        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }

        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }

        if (request.getEmail() == null || !request.getEmail().matches(EMAIL_REGEX)) {
            throw new IllegalArgumentException("Invalid email format");
        }

        if (request.getPassword() == null || !request.getPassword().matches(PASSWORD_REGEX)) {
            throw new IllegalArgumentException(
                    "Password must be 8+ chars with uppercase, lowercase, and number"
            );
        }

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
        subscriptionService.createFreeTrial(user);

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
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponseDto.builder()
                .id(user.getId())
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public void requestPasswordReset(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return;
        }

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


    @Override
    public String verifyEmail(String token) {

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification link"));

        if (user.isVerified()) {
            return "Email already verified.";
        }

        if (user.getTokenExpiry() == null ||
                user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification link expired");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);

        userRepository.save(user);

        return "Email verified successfully";
    }

    @Override
    public String resendVerification(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("Email already verified");
        }

        if (user.getTokenExpiry() != null &&
                user.getTokenExpiry().isAfter(LocalDateTime.now().minusMinutes(2))) {
            throw new RuntimeException("Please wait before requesting another email");
        }

        String newToken = UUID.randomUUID().toString();

        user.setVerificationToken(newToken);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFirstName(),
                newToken
        );

        return "Verification email resent successfully";
    }

    @Override
    public void validateResetToken(String token) {

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetPasswordExpiry() == null ||
                user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }
    }

    @Override
    public UserProfileDto getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        String profileImageUrl = profileImageRepository.findByUser(user)
                .map(UserProfileImage::getImageUrl)
                .orElse(null);
        return UserProfileDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .verified(user.isVerified())
                .profileImageUrl(profileImageUrl)   // ← real URL from DB
                .build();
    }

    @Override
    public UserProfileDto updateProfile(UpdateProfileDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepository.save(user);

        return UserProfileDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public void changePassword(ChangePasswordDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (!request.getNewPassword().matches(PASSWORD_REGEX)) {
            throw new IllegalArgumentException("Password must be 8+ chars with uppercase, lowercase, and number");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserProfileDto updateProfileImage(String base64Image) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserProfileImage> existing = profileImageRepository.findByUser(user);

        // if exists, delete old image from Cloudinary first
        existing.ifPresent(profileImage -> cloudinaryService.deleteImage(profileImage.getPublicId()));

        // upload new image to Cloudinary
        Map<String, String> uploadResult = cloudinaryService.uploadBase64Image(base64Image, "splendid/profile-images");

        // save or update ProfileImage entity
        UserProfileImage profileImage = existing.orElse(new UserProfileImage());
        profileImage.setUser(user);
        profileImage.setImageUrl(uploadResult.get("url"));
        profileImage.setPublicId(uploadResult.get("publicId"));

        profileImageRepository.save(profileImage);

        return UserProfileDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .verified(user.isVerified())
                .profileImageUrl(uploadResult.get("url"))
                .build();
    }
}