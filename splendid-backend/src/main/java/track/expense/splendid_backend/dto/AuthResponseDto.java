package track.expense.splendid_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private Long id;
    private String role;
    private String token;
    private String email;
    private String firstName;
    private String lastName;

}
