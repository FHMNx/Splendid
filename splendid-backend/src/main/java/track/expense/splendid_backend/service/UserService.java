package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.AuthResponseDto;
import track.expense.splendid_backend.dto.LoginRequestDto;
import track.expense.splendid_backend.dto.RegisterRequestDto;

public interface UserService {
    void register(RegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto request);
}
