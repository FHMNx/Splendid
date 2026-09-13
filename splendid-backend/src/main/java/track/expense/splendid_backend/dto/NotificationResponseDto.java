package track.expense.splendid_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {

    private Long id;
    private String title;
    private String message;
    private String type;
    private Long referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
