package track.expense.splendid_backend.dto;

import lombok.*;
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
}