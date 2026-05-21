package track.expense.splendid_backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String plan;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private String orderId;
    private String notes;
    private LocalDateTime paidAt;
}