package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import track.expense.splendid_backend.dto.TicketCreateDto;
import track.expense.splendid_backend.dto.TicketMessageDto;
import track.expense.splendid_backend.dto.TicketMessageResponseDto;
import track.expense.splendid_backend.dto.TicketResponseDto;
import track.expense.splendid_backend.entity.*;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.repository.NotificationRepository;
import track.expense.splendid_backend.repository.SupportTicketRepository;
import track.expense.splendid_backend.repository.TicketMessageRepository;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.EmailService;
import track.expense.splendid_backend.service.SupportTicketService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupportTicketServiceImpl implements SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public TicketResponseDto createTicket(TicketCreateDto request) {
        User user = getCurrentUser();

        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(request.getSubject().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory() != null ? request.getCategory() : TicketCategory.GENERAL)
                .priority(request.getPriority() != null ? request.getPriority() : TicketPriority.MEDIUM)
                .status(TicketStatus.OPEN)
                .build();

        SupportTicket savedTicket = supportTicketRepository.save(ticket);

        try {
            String userName = (user.getFirstName() != null ? user.getFirstName() : "User").trim();
            if (userName.isEmpty()) {
                userName = "User";
            }
            emailService.sendTicketCreatedEmail(user.getEmail(), userName, savedTicket.getTicketNumber(), savedTicket.getSubject());
            emailService.sendAdminTicketAlertEmail(savedTicket.getTicketNumber(), savedTicket.getSubject());
        } catch (Exception e) {
            log.error("Failed to send ticket creation email for ticket {}", savedTicket.getTicketNumber(), e);
        }

        return mapToTicketResponseDto(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDto> getMyTickets() {
        User user = getCurrentUser();
        return supportTicketRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToTicketResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponseDto> getAllTickets(Pageable pageable) {
        return supportTicketRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToTicketResponseDto);
    }

    @Override
    @Transactional
    public TicketResponseDto updateTicketStatus(Long id, TicketStatus status) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        ticket.setStatus(status);
        SupportTicket updatedTicket = supportTicketRepository.save(ticket);

        try {
            Notification notification = Notification.builder()
                    .user(ticket.getUser())
                    .title("Ticket Status Updated")
                    .message("Your ticket #" + ticket.getTicketNumber() + " status has been updated to " + status + ".")
                    .type(NotificationType.TICKET_STATUS)
                    .referenceId(ticket.getId())
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to create ticket status update notification for ticket {}", ticket.getTicketNumber(), e);
        }

        return mapToTicketResponseDto(updatedTicket);
    }

    @Override
    @Transactional
    public TicketMessageResponseDto addMessage(Long ticketId, TicketMessageDto request) {
        User currentUser = getCurrentUser();
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isOwner = ticket.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new ResourceNotFoundException("Unauthorized to access this ticket");
        }

        TicketMessage message = TicketMessage.builder()
                .ticket(ticket)
                .sender(currentUser)
                .message(request.getMessage().trim())
                .isAdminReply(isAdmin)
                .build();

        TicketMessage savedMessage = ticketMessageRepository.save(message);

        if (isAdmin) {
            try {
                String userName = (ticket.getUser().getFirstName() != null ? ticket.getUser().getFirstName() : "User").trim();
                if (userName.isEmpty()) {
                    userName = "User";
                }
                emailService.sendTicketReplyEmail(ticket.getUser().getEmail(), userName, ticket.getTicketNumber(), request.getMessage().trim());
            } catch (Exception e) {
                log.error("Failed to send ticket reply email for ticket {}", ticket.getTicketNumber(), e);
            }

            try {
                String preview = request.getMessage().trim();
                if (preview.length() > 80) {
                    preview = preview.substring(0, 77) + "...";
                }

                Notification notification = Notification.builder()
                        .user(ticket.getUser())
                        .title("New Reply on Ticket #" + ticket.getTicketNumber())
                        .message("Admin replied: " + preview)
                        .type(NotificationType.TICKET_REPLY)
                        .referenceId(ticket.getId())
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            } catch (Exception e) {
                log.error("Failed to create ticket reply notification for ticket {}", ticket.getTicketNumber(), e);
            }
        }

        return mapToTicketMessageResponseDto(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketMessageResponseDto> getTicketMessages(Long ticketId) {
        User currentUser = getCurrentUser();
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isOwner = ticket.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new ResourceNotFoundException("Unauthorized to access this ticket");
        }

        return ticketMessageRepository.findByTicketOrderByCreatedAtAsc(ticket)
                .stream()
                .map(this::mapToTicketMessageResponseDto)
                .toList();
    }

    private TicketResponseDto mapToTicketResponseDto(SupportTicket ticket) {
        String userName = "";
        if (ticket.getUser() != null) {
            String firstName = ticket.getUser().getFirstName() != null ? ticket.getUser().getFirstName() : "";
            String lastName = ticket.getUser().getLastName() != null ? ticket.getUser().getLastName() : "";
            userName = (firstName + " " + lastName).trim();
            if (userName.isEmpty()) {
                userName = "User";
            }
        }

        return TicketResponseDto.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .category(ticket.getCategory() != null ? ticket.getCategory().name() : null)
                .priority(ticket.getPriority() != null ? ticket.getPriority().name() : null)
                .status(ticket.getStatus() != null ? ticket.getStatus().name() : null)
                .userEmail(ticket.getUser() != null ? ticket.getUser().getEmail() : null)
                .userName(userName)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private TicketMessageResponseDto mapToTicketMessageResponseDto(TicketMessage msg) {
        String senderName;
        if (msg.isAdminReply()) {
            senderName = "Support Team";
        } else if (msg.getSender() != null) {
            String firstName = msg.getSender().getFirstName() != null ? msg.getSender().getFirstName() : "";
            String lastName = msg.getSender().getLastName() != null ? msg.getSender().getLastName() : "";
            senderName = (firstName + " " + lastName).trim();
            if (senderName.isEmpty()) {
                senderName = "User";
            }
        } else {
            senderName = "User";
        }

        return TicketMessageResponseDto.builder()
                .id(msg.getId())
                .message(msg.getMessage())
                .isAdminReply(msg.isAdminReply())
                .senderName(senderName)
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
