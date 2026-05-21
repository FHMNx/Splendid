package track.expense.splendid_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import track.expense.splendid_backend.entity.Payment;
import track.expense.splendid_backend.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findAllByOrderByPaidAtDesc();

    List<Payment> findByUser(User user);

    List<Payment> findByPaidAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' " +
            "AND MONTH(p.paidAt) = MONTH(CURRENT_DATE) " +
            "AND YEAR(p.paidAt) = YEAR(CURRENT_DATE)")
    BigDecimal getMonthlyRevenue();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' " +
            "AND YEAR(p.paidAt) = YEAR(CURRENT_DATE)")
    BigDecimal getYearlyRevenue();
}