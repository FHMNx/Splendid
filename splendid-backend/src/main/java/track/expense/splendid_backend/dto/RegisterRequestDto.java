package track.expense.splendid_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
