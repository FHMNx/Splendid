package track.expense.splendid_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketMessageDto {

    @NotBlank(message = "Message is required")
    private String message;
}
