package track.expense.splendid_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import track.expense.splendid_backend.entity.Transaction;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByType(Transaction.TransactionType type);
    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Transaction> findByCategoryId(Long categoryId);
    List<Transaction> findByUserId(Long userId);
}

