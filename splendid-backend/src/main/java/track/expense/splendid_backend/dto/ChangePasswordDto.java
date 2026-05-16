package track.expense.splendid_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordDto {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}