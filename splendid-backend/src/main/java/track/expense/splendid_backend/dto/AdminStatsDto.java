package track.expense.splendid_backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    private long totalUsers;
    private long verifiedUsers;
    private long unverifiedUsers;
    private long totalTransactions;
    private BigDecimal platformTotalIncome;
    private BigDecimal platformTotalExpense;
    private BigDecimal platformNetBalance;
    private long totalBudgets;
}