package track.expense.splendid_backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionSummaryDto {
    private Long totalTransactions;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netBalance;
    private BigDecimal todayExpense;
    private BigDecimal monthlyExpense;
    private BigDecimal monthlyIncome;
    private double todayExpenseChange;
    private double monthlyExpenseChange;
    private double totalIncomeChange;
    private double monthlyIncomeChange;
}
