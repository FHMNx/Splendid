package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.AuthResponseDto;
import track.expense.splendid_backend.dto.LoginRequestDto;
import track.expense.splendid_backend.dto.RegisterRequestDto;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterRequestDto request) {

    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        return null;
    }
}
