package track.expense.splendid_backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.CategoryBreakdownDto;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.dto.TransactionSummaryDto;
import track.expense.splendid_backend.dto.TrendDataDto;
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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


    @Override
    public List<TrendDataDto> getTransactionTrend(String range) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Transaction> all = transactionRepository.findByUser(user);
        LocalDate today = LocalDate.now();

        // filter transactions by range
        List<Transaction> filtered = all.stream()
                .filter(t -> {
                    return switch (range) {
                        case "7d" -> !t.getDate().isBefore(today.minusDays(6));
                        case "3m" -> !t.getDate().isBefore(today.minusMonths(3).withDayOfMonth(1));
                        default -> !t.getDate().isBefore(today.withDayOfMonth(1)); // 30d = this month
                    };
                })
                .toList();
        Map<String, TrendDataDto> grouped = new LinkedHashMap<>();

        if (range.equals("7d")) {
            // last 7 days — label = day name (Mon, Tue...)
            for (int i = 6; i >= 0; i--) {
                LocalDate date = today.minusDays(i);
                String label = date.getDayOfWeek()
                        .getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);
                grouped.put(date.toString(), TrendDataDto.builder()
                        .label(label).income(0).expense(0).build());
            }

            filtered.forEach(t -> {
                String key = t.getDate().toString();
                if (grouped.containsKey(key)) {
                    TrendDataDto dto = grouped.get(key);
                    double amount = t.getAmount().doubleValue();
                    if (t.getType() == Transaction.TransactionType.INCOME) {
                        dto.setIncome(dto.getIncome() + amount);
                    } else {
                        dto.setExpense(dto.getExpense() + amount);
                    }
                }
            });

        } else if (range.equals("30d")) {
            // this month — label = W1, W2, W3, W4
            for (int week = 1; week <= 4; week++) {
                String key = "W" + week;
                grouped.put(key, TrendDataDto.builder()
                        .label(key).income(0).expense(0).build());
            }

            filtered.forEach(t -> {
                int weekNum = Math.min((t.getDate().getDayOfMonth() - 1) / 7 + 1, 4);
                String key = "W" + weekNum;
                TrendDataDto dto = grouped.get(key);
                double amount = t.getAmount().doubleValue();
                if (t.getType() == Transaction.TransactionType.INCOME) {
                    dto.setIncome(dto.getIncome() + amount);
                } else {
                    dto.setExpense(dto.getExpense() + amount);
                }
            });

        } else {
            // 3m — label = month name (Jan, Feb, Mar)
            for (int i = 2; i >= 0; i--) {
                LocalDate month = today.minusMonths(i).withDayOfMonth(1);
                String label = month.getMonth()
                        .getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);
                String key = month.getYear() + "-" + month.getMonthValue();
                grouped.put(key, TrendDataDto.builder()
                        .label(label).income(0).expense(0).build());
            }

            filtered.forEach(t -> {
                String key = t.getDate().getYear() + "-" + t.getDate().getMonthValue();
                if (grouped.containsKey(key)) {
                    TrendDataDto dto = grouped.get(key);
                    double amount = t.getAmount().doubleValue();
                    if (t.getType() == Transaction.TransactionType.INCOME) {
                        dto.setIncome(dto.getIncome() + amount);
                    } else {
                        dto.setExpense(dto.getExpense() + amount);
                    }
                }
            });
        }

        return new ArrayList<>(grouped.values());
    }

    @Override
    public List<CategoryBreakdownDto> getCategoryBreakdown() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Transaction> all = transactionRepository.findByUser(user);

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        // only this month's expenses
        Map<String, Double> categoryTotals = all.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE
                        && t.getDate().getMonthValue() == currentMonth
                        && t.getDate().getYear() == currentYear
                        && t.getCategory() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getName(),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ));

        double total = categoryTotals.values().stream()
                .mapToDouble(Double::doubleValue).sum();

        if (total == 0) return List.of();

        return categoryTotals.entrySet().stream()
                .map(entry -> CategoryBreakdownDto.builder()
                        .name(entry.getKey())
                        .value(Math.round((entry.getValue() / total) * 100.0 * 10.0) / 10.0)
                        .build())
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .collect(Collectors.toList());
    }


}
