package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.AuthResponseDto;
import track.expense.splendid_backend.dto.LoginRequestDto;
import track.expense.splendid_backend.dto.RegisterRequestDto;

public interface UserService {
    void register(RegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto request);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    String verifyEmail(String token);
    String resendVerification(String email);
    void validateResetToken(String token);
}
