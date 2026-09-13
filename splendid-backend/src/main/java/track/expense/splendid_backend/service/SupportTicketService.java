package track.expense.splendid_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import track.expense.splendid_backend.dto.TicketCreateDto;
import track.expense.splendid_backend.dto.TicketMessageDto;
import track.expense.splendid_backend.dto.TicketMessageResponseDto;
import track.expense.splendid_backend.dto.TicketResponseDto;
import track.expense.splendid_backend.entity.TicketStatus;

import java.util.List;

public interface SupportTicketService {

    TicketResponseDto createTicket(TicketCreateDto request);

    List<TicketResponseDto> getMyTickets();

    Page<TicketResponseDto> getAllTickets(Pageable pageable);

    TicketResponseDto updateTicketStatus(Long id, TicketStatus status);

    TicketMessageResponseDto addMessage(Long ticketId, TicketMessageDto request);

    List<TicketMessageResponseDto> getTicketMessages(Long ticketId);
}
