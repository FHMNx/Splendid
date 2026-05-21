package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.*;
import track.expense.splendid_backend.entity.Payment;
import track.expense.splendid_backend.entity.Subscription;
import track.expense.splendid_backend.entity.Transaction;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.mapper.TransactionMapper;
import track.expense.splendid_backend.repository.*;
import track.expense.splendid_backend.service.AdminService;
import track.expense.splendid_backend.service.SubscriptionService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionService subscriptionService;

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

                    // get subscription info
                    String plan = "NONE";
                    String status = "NONE";
                    LocalDate endDate = null;
                    long daysRemaining = 0;

                    var subscription = subscriptionRepository.findByUser(user);
                    if (subscription.isPresent()) {
                        var sub = subscription.get();

                        // auto-expire check
                        if (sub.getEndDate().isBefore(LocalDate.now())
                                && sub.getStatus() == Subscription.Status.ACTIVE) {
                            sub.setStatus(Subscription.Status.EXPIRED);
                            subscriptionRepository.save(sub);
                        }

                        plan = sub.getPlan().name();
                        status = sub.getStatus().name();
                        endDate = sub.getEndDate();
                        daysRemaining = Math.max(0,
                                java.time.temporal.ChronoUnit.DAYS.between(
                                        LocalDate.now(), sub.getEndDate()));
                    }

                    return AdminUserDto.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .verified(user.isVerified())
                            .createdAt(user.getCreatedAt())
                            .transactionCount(txCount)
                            .subscriptionPlan(plan)
                            .subscriptionStatus(status)
                            .subscriptionEndDate(endDate)
                            .subscriptionDaysRemaining(daysRemaining)
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

    @Override
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAllByOrderByPaidAtDesc()
                .stream()
                .map(this::toPaymentDto)
                .toList();
    }

    @Override
    public PaymentSummaryDto getPaymentSummary() {
        long totalPaidUsers = paymentRepository.findAllByOrderByPaidAtDesc()
                .stream()
                .map(p -> p.getUser().getId())
                .distinct()
                .count();

        return PaymentSummaryDto.builder()
                .totalRevenue(nullSafe(paymentRepository.getTotalRevenue()))
                .monthlyRevenue(nullSafe(paymentRepository.getMonthlyRevenue()))
                .yearlyRevenue(nullSafe(paymentRepository.getYearlyRevenue()))
                .totalPayments(paymentRepository.count())
                .totalPaidUsers(totalPaidUsers)
                .build();
    }

    @Override
    public PaymentDto recordPayment(RecordPaymentDto request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // determine amount from plan if not provided
        java.math.BigDecimal amount = request.getAmount();
        if (amount == null) {
            amount = switch (request.getPlan()) {
                case "MONTHLY"     -> new java.math.BigDecimal("499.00");
                case "HALF_YEARLY" -> new java.math.BigDecimal("2499.00");
                case "YEARLY"      -> new java.math.BigDecimal("3999.00");
                default            -> java.math.BigDecimal.ZERO;
            };
        }

        Payment payment = Payment.builder()
                .user(user)
                .plan(Payment.Plan.valueOf(request.getPlan()))
                .amount(amount)
                .paymentMethod(Payment.PaymentMethod.valueOf(request.getPaymentMethod()))
                .status(Payment.PaymentStatus.COMPLETED)
                .notes(request.getNotes())
                .orderId(null)
                .paidAt(request.getPaidAt() != null
                        ? request.getPaidAt()
                        : java.time.LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);

        // also activate the subscription
        subscriptionService.activatePlan(user.getId(), request.getPlan());

        return toPaymentDto(saved);
    }

    //helpers
    private PaymentDto toPaymentDto(Payment p) {
        return PaymentDto.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userName(p.getUser().getFirstName() + " " + p.getUser().getLastName())
                .userEmail(p.getUser().getEmail())
                .plan(p.getPlan().name())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod().name())
                .status(p.getStatus().name())
                .orderId(p.getOrderId())
                .notes(p.getNotes())
                .paidAt(p.getPaidAt())
                .build();
    }

    private java.math.BigDecimal nullSafe(java.math.BigDecimal value) {
        return value != null ? value : java.math.BigDecimal.ZERO;
    }
}