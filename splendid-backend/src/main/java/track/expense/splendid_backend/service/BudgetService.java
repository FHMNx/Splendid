package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.BudgetDto;
import track.expense.splendid_backend.dto.BudgetRequestDto;

import java.util.List;

public interface BudgetService {
    BudgetDto createOrUpdateBudget(BudgetRequestDto request);
    List<BudgetDto> getBudgetsForMonth(int month, int year);
    void deleteBudget(Long budgetId);
}
