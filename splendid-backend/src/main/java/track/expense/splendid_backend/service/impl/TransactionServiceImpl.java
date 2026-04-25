package track.expense.splendid_backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.entity.Transaction;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.mapper.TransactionMapper;
import track.expense.splendid_backend.repository.TransactionRepository;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.TransactionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TransactionRepository transactionRepository;
    private UserRepository userRepository;

    @Override
    public TransactionDto createTransaction(TransactionDto transactionDto) {
        Transaction transaction = TransactionMapper.toEntity(transactionDto);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        transaction.setUser(user);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return TransactionMapper.toDto(savedTransaction);
    }

    @Override
    public TransactionDto getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ResourceNotFoundException("Transaction not found with this id : " + transactionId));
        return TransactionMapper.toDto(transaction);
    }

    @Override
    public List<TransactionDto> getAllTransactions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Transaction> transactions = transactionRepository.findByUser(user);
        return transactions.stream().map(TransactionMapper::toDto).toList();
    }

    @Override
    public TransactionDto updateTransaction(Long transactionId, TransactionDto transactionDto) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ResourceNotFoundException("Transaction not found with this id : " + transactionId));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!transaction.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("unauthorized access");
        }

        transaction.setTitle(transactionDto.getTitle());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setType(Transaction.TransactionType.valueOf(transactionDto.getType().toUpperCase()));
        transaction.setDate(transactionDto.getDate());
        transaction.setPaymentMethod(Transaction.PaymentMethod.valueOf(transactionDto.getPaymentMethod().toUpperCase()));
        transaction.setNotes(transactionDto.getNotes());
        transaction.setCategoryId(transactionDto.getCategoryId());
        Transaction updatedTransaction = transactionRepository.save(transaction);

        return TransactionMapper.toDto(updatedTransaction);
    }

    @Override
    public void deleteTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ResourceNotFoundException("Transaction not found with this id : " + transactionId));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!transaction.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("unauthorized access");
        }
        transactionRepository.deleteById(transactionId);
    }


}
