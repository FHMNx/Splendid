package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.BudgetDto;
import track.expense.splendid_backend.dto.BudgetRequestDto;
import track.expense.splendid_backend.entity.*;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.repository.*;
import track.expense.splendid_backend.service.BudgetService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public BudgetDto createOrUpdateBudget(BudgetRequestDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // update if exists for same category/month/year, else create new
        Budget budget = budgetRepository.findByUserAndCategoryAndMonthAndYear(user, category, request.getMonth(), request.getYear()).orElse(Budget.builder()
                .user(user)
                .category(category)
                .month(request.getMonth())
                .year(request.getYear())
                .build());

        budget.setLimitAmount(request.getLimitAmount());
        budgetRepository.save(budget);

        return buildBudgetDto(budget, user);
    }

    @Override
    public List<BudgetDto> getBudgetsForMonth(int month, int year) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return budgetRepository.findByUserAndMonthAndYear(user, month, year)
                .stream()
                .map(budget -> buildBudgetDto(budget, user))
                .toList();
    }

    @Override
    public void deleteBudget(Long budgetId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Budget budget = budgetRepository.findById(budgetId).orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Unauthorized");
        }

        budgetRepository.deleteById(budgetId);
    }

    // helper — calculate spent amount and build dto
    private BudgetDto buildBudgetDto(Budget budget, User user) {

        List<Transaction> transactions = transactionRepository.findByUser(user);

        BigDecimal spent = transactions.stream().filter(t -> t.getType() == Transaction.TransactionType.EXPENSE
                        && t.getCategory() != null
                        && t.getCategory().getId().equals(budget.getCategory().getId())
                        && t.getDate().getMonthValue() == budget.getMonth()
                        && t.getDate().getYear() == budget.getYear()
                )
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double percentage = 0;
        if (budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0) {
            percentage = spent
                    .divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        String status;
        if (percentage >= 100) {
            status = "OVER";
        } else if (percentage >= 80) {
            status = "WARNING";
        } else {
            status = "GOOD";
        }

        return BudgetDto.builder()
                .id(budget.getId())
                .categoryId(budget.getCategory().getId())
                .categoryName(budget.getCategory().getName())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(spent)
                .percentage(Math.round(percentage * 10.0) / 10.0)
                .status(status)
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}