package track.expense.splendid_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import track.expense.splendid_backend.entity.SupportTicket;
import track.expense.splendid_backend.entity.User;

import java.util.List;
import java.util.Optional;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByUserOrderByCreatedAtDesc(User user);

    Page<SupportTicket> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<SupportTicket> findByTicketNumber(String ticketNumber);
}
