package track.expense.splendid_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.dto.BudgetDto;
import track.expense.splendid_backend.dto.BudgetRequestDto;
import track.expense.splendid_backend.service.BudgetService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetDto>> createOrUpdateBudget(@RequestBody BudgetRequestDto budgetDto) {
        BudgetDto budget = budgetService.createOrUpdateBudget(budgetDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BudgetDto>builder()
                        .success(true)
                        .message("Budget created successfully")
                        .data(budget)
                        .build()
        );
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        List<BudgetDto> budgets = budgetService.getBudgetsForMonth(m, y);
        return ResponseEntity.ok(
                ApiResponse.<List<BudgetDto>>builder()
                        .success(true)
                        .message("Budgets fetched successfully")
                        .data(budgets)
                        .build()
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Budget deleted successfully")
                        .build()
        );
    }


}
