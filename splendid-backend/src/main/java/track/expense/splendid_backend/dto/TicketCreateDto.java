package track.expense.splendid_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import track.expense.splendid_backend.entity.TicketCategory;
import track.expense.splendid_backend.entity.TicketPriority;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCreateDto {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private TicketCategory category;
    private TicketPriority priority;
}
