package track.expense.splendid_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketMessageResponseDto {

    private Long id;
    private String message;
    private boolean isAdminReply;
    private String senderName;
    private LocalDateTime createdAt;
}
