package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.TransactionDto;

public interface TransactionService {

    TransactionDto createTransaction(TransactionDto transactionDto);

}
