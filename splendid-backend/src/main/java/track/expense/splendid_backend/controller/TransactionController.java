package track.expense.splendid_backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.service.TransactionService;

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
}
