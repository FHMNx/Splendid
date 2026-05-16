package track.expense.splendid_backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.dto.TransactionSummaryDto;
import track.expense.splendid_backend.entity.Category;
import track.expense.splendid_backend.entity.Transaction;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.mapper.TransactionMapper;
import track.expense.splendid_backend.repository.CategoryRepository;
import track.expense.splendid_backend.repository.TransactionRepository;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.TransactionService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TransactionRepository transactionRepository;
    private UserRepository userRepository;
    private CategoryRepository categoryRepository;

    @Override
    public TransactionDto createTransaction(TransactionDto transactionDto) {
        Transaction transaction = TransactionMapper.toEntity(transactionDto);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(transactionDto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        transaction.setCategory(category);
        transaction.setUser(user);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return TransactionMapper.toDto(savedTransaction);
    }

    @Override
    public TransactionDto getTransactionById(Long transactionId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!transaction.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("User not found");
        }
        return TransactionMapper.toDto(transaction);
    }

    @Override
    public Page<TransactionDto> getAllTransactions(int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);

        Page<Transaction> transactions = transactionRepository.findByUser(user, pageable);
        return transactions.map(TransactionMapper::toDto);
    }

    @Override
    public TransactionDto updateTransaction(Long transactionId, TransactionDto transactionDto) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
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

        Category category = categoryRepository.findById(transactionDto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        transaction.setCategory(category);

        Transaction updatedTransaction = transactionRepository.save(transaction);

        return TransactionMapper.toDto(updatedTransaction);
    }

    @Override
    public void deleteTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!transaction.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("unauthorized access");
        }
        transactionRepository.deleteById(transactionId);
    }

    @Override
    public TransactionSummaryDto getTransactionSummary() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Transaction> allTransactions = transactionRepository.findByUser(user);

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();
        int lastMonth = today.minusMonths(1).getMonthValue();
        int lastMonthYear = today.minusMonths(1).getYear();

        BigDecimal totalIncome = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal todayExpense = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE && t.getDate().equals(today))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal yesterdayExpense = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE
                        && t.getDate().equals(yesterday))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyExpense = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE
                        && t.getDate().getMonthValue() == currentMonth
                        && t.getDate().getYear() == currentYear)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lastMonthExpense = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE
                        && t.getDate().getMonthValue() == lastMonth
                        && t.getDate().getYear() == lastMonthYear)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyIncome = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME
                        && t.getDate().getMonthValue() == currentMonth
                        && t.getDate().getYear() == currentYear)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lastMonthIncome = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME
                        && t.getDate().getMonthValue() == lastMonth
                        && t.getDate().getYear() == lastMonthYear)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return TransactionSummaryDto.builder()
                .totalTransactions((long) allTransactions.size())
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(totalIncome.subtract(totalExpense))
                .todayExpense(todayExpense)
                .monthlyExpense(monthlyExpense)
                .monthlyIncome(monthlyIncome)
                .todayExpenseChange(calculateChange(todayExpense, yesterdayExpense))
                .monthlyExpenseChange(calculateChange(monthlyExpense, lastMonthExpense))
                .totalIncomeChange(calculateChange(monthlyIncome, lastMonthIncome))
                .monthlyIncomeChange(calculateChange(monthlyIncome, lastMonthIncome))
                .build();
    }

    private double calculateChange(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }


}
