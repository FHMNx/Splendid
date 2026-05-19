package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.AdminStatsDto;
import track.expense.splendid_backend.dto.AdminUserDto;
import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.entity.Transaction;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.mapper.TransactionMapper;
import track.expense.splendid_backend.repository.*;
import track.expense.splendid_backend.service.AdminService;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    @Override
    public AdminStatsDto getStats() {
        List<User> allUsers = userRepository.findAll();
        List<Transaction> allTransactions = transactionRepository.findAll();

        long verifiedUsers = allUsers.stream().filter(User::isVerified).count();

        BigDecimal totalIncome = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = allTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminStatsDto.builder()
                .totalUsers(allUsers.size())
                .verifiedUsers(verifiedUsers)
                .unverifiedUsers(allUsers.size() - verifiedUsers)
                .totalTransactions(allTransactions.size())
                .platformTotalIncome(totalIncome)
                .platformTotalExpense(totalExpense)
                .platformNetBalance(totalIncome.subtract(totalExpense))
                .totalBudgets(budgetRepository.count())
                .build();
    }

    @Override
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    long txCount = transactionRepository.findByUser(user).size();
                    return AdminUserDto.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .verified(user.isVerified())
                            .createdAt(user.getCreatedAt())
                            .transactionCount(txCount)
                            .build();
                })
                .toList();
    }

    @Override
    public void toggleUserVerification(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setVerified(!user.isVerified());
        userRepository.save(user);
    }

    @Override
    public Page<TransactionDto> getAllTransactions(int page, int size) {
        return transactionRepository.findAll(PageRequest.of(page, size)).map(TransactionMapper::toDto);
    }
}