package track.expense.splendid_backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.service.TransactionService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private TransactionService transactionService;

    //ADD TRANSACTION
    @PostMapping("/create")
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody TransactionDto transactionDto) {
       TransactionDto savedTransaction = transactionService.createTransaction(transactionDto);
       return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
    }

    //GET TRANSACTION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransactionById(@PathVariable("id") Long transactionId) {
       TransactionDto transactionDto = transactionService.getTransactionById(transactionId);
       return  ResponseEntity.ok(transactionDto);
    }

    //GET ALL TRANSACTIONS
    @GetMapping("/all")
    public ResponseEntity<List<TransactionDto>> getAllTransactions() {
       List<TransactionDto> transactions = transactionService.getAllTransactions();
       return ResponseEntity.ok(transactions);
    }

    //UPDATE TRANSACTION
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> updateTransaction(@PathVariable("id") Long transactionId, @RequestBody TransactionDto transactionDto) {
       TransactionDto updatedTransaction = transactionService.updateTransaction(transactionId, transactionDto);
       return ResponseEntity.status(HttpStatus.OK).body(updatedTransaction);
    }

    //DELETE TRANSACTION
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable("id") Long transactionId) {
       transactionService.deleteTransaction(transactionId);
       return ResponseEntity.ok("Transaction deleted successfully");
    }

}
