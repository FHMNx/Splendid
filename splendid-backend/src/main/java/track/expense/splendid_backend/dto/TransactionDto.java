package track.expense.splendid_backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDto {
    private Long id;
    private String title;
    private BigDecimal amount;
    private LocalDate date;
    private String type;
    private String paymentMethod;
    private String notes;
    private Long categoryId;
}
