package track.expense.splendid_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import track.expense.splendid_backend.entity.SupportTicket;
import track.expense.splendid_backend.entity.TicketMessage;

import java.util.List;

public interface TicketMessageRepository extends JpaRepository<TicketMessage, Long> {

    List<TicketMessage> findByTicketOrderByCreatedAtAsc(SupportTicket ticket);
}
