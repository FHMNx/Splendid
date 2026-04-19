package track.expense.splendid_backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.entity.Transaction;
import track.expense.splendid_backend.mapper.TransactionMapper;
import track.expense.splendid_backend.repository.TransactionRepository;
import track.expense.splendid_backend.service.TransactionService;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TransactionRepository transactionRepository;

    @Override
    public TransactionDto createTransaction(TransactionDto transactionDto) {
        Transaction transaction = TransactionMapper.toEntity(transactionDto);
        Transaction savedTransaction = transactionRepository.save(transaction);

        return TransactionMapper.toDto(savedTransaction);
    }
}
