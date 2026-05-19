package track.expense.splendid_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionDto {
    private Long id;
    private String plan;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private long daysRemaining;

    @JsonProperty("isActive")
    private boolean isActive;
}
