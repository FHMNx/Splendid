package track.expense.splendid_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private boolean verified;
    private String profileImageUrl;
}