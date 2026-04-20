package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.TransactionDto;

import java.util.List;

public interface TransactionService {

    TransactionDto createTransaction(TransactionDto transactionDto);

    TransactionDto getTransactionById(Long transactionId);

    List<TransactionDto> getAllTransactions();

    TransactionDto updateTransaction(Long transactionId , TransactionDto transactionDto);

    void deleteTransaction(Long transactionId);

}
