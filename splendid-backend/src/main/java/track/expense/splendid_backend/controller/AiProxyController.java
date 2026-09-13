package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import track.expense.splendid_backend.dto.AiChatRequestDto;
import track.expense.splendid_backend.dto.ApiResponse;
import track.expense.splendid_backend.service.AiProxyService;

@Tag(name = "AI Assistant", description = "Secure backend proxy for Groq AI personal finance assistant")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiProxyController {

    private final AiProxyService aiProxyService;

    @Operation(summary = "Chat with AI Financial Assistant", description = "Proxies prompt and user context securely to Groq API")
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody AiChatRequestDto request) {
        String reply = aiProxyService.generateChatResponse(request);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("AI response generated successfully")
                .data(reply)
                .build());
    }
}
