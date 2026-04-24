package track.expense.splendid_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDto {
    private String email;
    private String password;
}
