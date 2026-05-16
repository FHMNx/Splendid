package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.*;

public interface UserService {
    void register(RegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto request);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    String verifyEmail(String token);
    String resendVerification(String email);
    void validateResetToken(String token);

    UserProfileDto getProfile();
    UserProfileDto updateProfile(UpdateProfileDto request);
    void changePassword(ChangePasswordDto request);
    UserProfileDto updateProfileImage(String base64Image);
}
