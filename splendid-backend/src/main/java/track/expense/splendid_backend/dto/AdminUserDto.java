package track.expense.splendid_backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private boolean verified;
    private LocalDateTime createdAt;
    private long transactionCount;

    // subscription info
    private String subscriptionPlan;
    private String subscriptionStatus;
    private LocalDate subscriptionEndDate;
    private long subscriptionDaysRemaining;
}