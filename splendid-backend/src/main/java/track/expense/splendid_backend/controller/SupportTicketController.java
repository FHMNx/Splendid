package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.*;
import track.expense.splendid_backend.entity.TicketStatus;
import track.expense.splendid_backend.service.SupportTicketService;

import java.util.List;
import java.util.Map;

@Tag(name = "Support Tickets", description = "Endpoints for support ticketing system")
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    @Operation(summary = "Create a new support ticket")
    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponseDto>> createTicket(@Valid @RequestBody TicketCreateDto request) {
        TicketResponseDto ticket = supportTicketService.createTicket(request);
        return ResponseEntity.ok(ApiResponse.<TicketResponseDto>builder()
                .success(true)
                .message("Ticket created successfully")
                .data(ticket)
                .build());
    }

    @Operation(summary = "Get all tickets for the logged-in user")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponseDto>>> getMyTickets() {
        List<TicketResponseDto> tickets = supportTicketService.getMyTickets();
        return ResponseEntity.ok(ApiResponse.<List<TicketResponseDto>>builder()
                .success(true)
                .message("User tickets fetched successfully")
                .data(tickets)
                .build());
    }

    @Operation(summary = "Get all messages for a specific ticket")
    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<List<TicketMessageResponseDto>>> getTicketMessages(@PathVariable Long id) {
        List<TicketMessageResponseDto> messages = supportTicketService.getTicketMessages(id);
        return ResponseEntity.ok(ApiResponse.<List<TicketMessageResponseDto>>builder()
                .success(true)
                .message("Ticket messages fetched successfully")
                .data(messages)
                .build());
    }

    @Operation(summary = "Send a message/reply on a ticket")
    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<TicketMessageResponseDto>> addMessage(
            @PathVariable Long id,
            @Valid @RequestBody TicketMessageDto request) {
        TicketMessageResponseDto message = supportTicketService.addMessage(id, request);
        return ResponseEntity.ok(ApiResponse.<TicketMessageResponseDto>builder()
                .success(true)
                .message("Message sent successfully")
                .data(message)
                .build());
    }

    @Operation(summary = "Get all tickets across platform with pagination (Admin only)")
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<TicketResponseDto>>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TicketResponseDto> pageData = supportTicketService.getAllTickets(PageRequest.of(page, size));

        PageResponse<TicketResponseDto> pageResponse = PageResponse.<TicketResponseDto>builder()
                .content(pageData.getContent())
                .pageNumber(pageData.getNumber())
                .pageSize(pageData.getSize())
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .isLast(pageData.isLast())
                .hasNext(pageData.hasNext())
                .build();

        return ResponseEntity.ok(ApiResponse.<PageResponse<TicketResponseDto>>builder()
                .success(true)
                .message("All tickets fetched successfully")
                .data(pageResponse)
                .build());
    }

    @Operation(summary = "Update ticket status (Admin only)")
    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponseDto>> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
        TicketStatus status = TicketStatus.valueOf(statusStr.toUpperCase());
        TicketResponseDto ticket = supportTicketService.updateTicketStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<TicketResponseDto>builder()
                .success(true)
                .message("Ticket status updated successfully")
                .data(ticket)
                .build());
    }
}
