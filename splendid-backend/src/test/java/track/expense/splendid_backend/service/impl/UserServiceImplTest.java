package track.expense.splendid_backend.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import track.expense.splendid_backend.dto.RegisterRequestDto;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.EmailService;
import track.expense.splendid_backend.service.SubscriptionService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private UserServiceImpl userService;

    private RegisterRequestDto validRequest;

    @BeforeEach
    void setUp() {
        validRequest = RegisterRequestDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("Password123!")
                .build();
    }

    @Test
    @DisplayName("Should successfully register user when registration details are valid")
    void shouldRegisterUserSuccessfully() {
        // ARRANGE
        when(userRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("encryptedPassword123");

        // ACT
        assertDoesNotThrow(() -> userService.register(validRequest));

        // ASSERT
        // Verify that userRepository.save() was called exactly once
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("John", savedUser.getFirstName());
        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertEquals("encryptedPassword123", savedUser.getPassword());
        assertFalse(savedUser.isVerified()); // Verify initial state is unverified

        // Verify downstream service workflows were triggered
        verify(subscriptionService, times(1)).createFreeTrial(savedUser);
        verify(emailService, times(1)).sendVerificationEmail(
                eq("john.doe@example.com"),
                eq("John"),
                anyString()
        );
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when email format is invalid")
    void shouldThrowExceptionWhenEmailIsInvalid() {
        // ARRANGE
        validRequest.setEmail("invalid-email-format");

        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.register(validRequest);
        });

        assertEquals("Invalid email format", exception.getMessage());

        // Verify that database interactions were never attempted due to short-circuit validation
        verify(userRepository, never()).save(any(User.class));
    }
}