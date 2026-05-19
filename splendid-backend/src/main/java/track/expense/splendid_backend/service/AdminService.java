package track.expense.splendid_backend.service;

import org.springframework.data.domain.Page;
import track.expense.splendid_backend.dto.AdminStatsDto;
import track.expense.splendid_backend.dto.AdminUserDto;
import track.expense.splendid_backend.dto.TransactionDto;

import java.util.List;

public interface AdminService {
    AdminStatsDto getStats();

    List<AdminUserDto> getAllUsers();

    void toggleUserVerification(Long userId);

    Page<TransactionDto> getAllTransactions(int page, int size);
}
