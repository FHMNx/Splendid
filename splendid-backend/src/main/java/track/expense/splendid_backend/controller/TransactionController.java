package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.CategoryBreakdownDto;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.dto.TransactionSummaryDto;
import track.expense.splendid_backend.dto.TrendDataDto;
import track.expense.splendid_backend.dto.PageResponse;
import track.expense.splendid_backend.service.TransactionService;
import org.springframework.data.domain.Page;

import java.util.List;

@Tag(name = "Transactions", description = "Create, read, update and delete user transactions")
@AllArgsConstructor
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private TransactionService transactionService;

    //ADD TRANSACTION
    @Operation(summary = "Create transaction")
    @PostMapping("/create")
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody TransactionDto transactionDto) {
        TransactionDto savedTransaction = transactionService.createTransaction(transactionDto);
        return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
    }

    //GET TRANSACTION BY ID
    @Operation(summary = "Get transaction by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransactionById(@PathVariable("id") Long transactionId) {
        TransactionDto transactionDto = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(transactionDto);
    }

    //GET ALL TRANSACTIONS
    @Operation(summary = "Get all transactions (paginated)", description = "Returns paginated transactions for current user")
    @GetMapping("/all")
    public ResponseEntity<PageResponse<TransactionDto>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TransactionDto> pageData = transactionService.getAllTransactions(page, size);

        PageResponse<TransactionDto> pageResponse = PageResponse.<TransactionDto>builder()
                .content(pageData.getContent())
                .pageNumber(pageData.getNumber())
                .pageSize(pageData.getSize())
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .isLast(pageData.isLast())
                .hasNext(pageData.hasNext())
                .build();

        return ResponseEntity.ok(pageResponse);
    }

    //UPDATE TRANSACTION
    @Operation(summary = "Update transaction")
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> updateTransaction(@PathVariable("id") Long transactionId, @RequestBody TransactionDto transactionDto) {
        TransactionDto updatedTransaction = transactionService.updateTransaction(transactionId, transactionDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedTransaction);
    }

    //DELETE TRANSACTION
    @Operation(summary = "Delete transaction")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable("id") Long transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    //GET TRANSACTION SUMMARY
    @Operation(summary = "Get transaction summary", description = "Returns total income, expense, net balance and monthly/today breakdowns")
    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryDto> getTransactionSummery() {
        TransactionSummaryDto summary = transactionService.getTransactionSummary();
        return ResponseEntity.ok(summary);
    }

    @Operation(summary = "Get income vs expense trend", description = "Range: 7d, 30d, or 3m")
    @GetMapping("/trend")
    public ResponseEntity<List<TrendDataDto>> getTransactionTrend(
            @RequestParam(defaultValue = "30d") String range) {
        List<TrendDataDto> trend = transactionService.getTransactionTrend(range);
        return ResponseEntity.ok(trend);
    }


    @Operation(summary = "Get expense category breakdown for current month")
    @GetMapping("/category-breakdown")
    public ResponseEntity<List<CategoryBreakdownDto>> getCategoryBreakdown() {
        List<CategoryBreakdownDto> breakdown = transactionService.getCategoryBreakdown();
        return ResponseEntity.ok(breakdown);
    }

}
