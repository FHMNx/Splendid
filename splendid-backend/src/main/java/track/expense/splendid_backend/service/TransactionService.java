package track.expense.splendid_backend.service;

import org.springframework.data.domain.Page;
import track.expense.splendid_backend.dto.TransactionDto;

import java.util.List;

public interface TransactionService {

    TransactionDto createTransaction(TransactionDto transactionDto);

    TransactionDto getTransactionById(Long transactionId);

    Page<TransactionDto> getAllTransactions(int page , int size);

    TransactionDto updateTransaction(Long transactionId , TransactionDto transactionDto);

    void deleteTransaction(Long transactionId);

}
