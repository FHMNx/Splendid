package track.expense.splendid_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BudgetRequestDto {
    private Long categoryId;
    private BigDecimal limitAmount;
    private int month;
    private int year;
}
