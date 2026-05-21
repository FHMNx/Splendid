package track.expense.splendid_backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecordPaymentDto {
    private Long userId;
    private String plan;
    private BigDecimal amount;
    private String paymentMethod;
    private String notes;
    private LocalDateTime paidAt;
}