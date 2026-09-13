package track.expense.splendid_backend.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import track.expense.splendid_backend.dto.AiChatRequestDto;
import track.expense.splendid_backend.service.AiProxyService;

import java.util.*;

@Slf4j
@Service
public class AiProxyServiceImpl implements AiProxyService {

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String GROQ_MODEL = "openai/gpt-oss-20b";

    @Value("${app.groq.api.key:}")
    private String groqApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateChatResponse(AiChatRequestDto request) {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            throw new IllegalStateException("Groq API key is not configured on the backend server.");
        }

        String contextInfo = request.getCurrentContext() != null && !request.getCurrentContext().isBlank()
                ? request.getCurrentContext()
                : "No financial context available.";

        String systemPrompt = """
                You are Penny, a friendly and knowledgeable personal finance assistant built into Splendid — an expense and income tracking app.

                User's Current Financial Context:
                %s

                Your role:
                - Answer questions about their spending, income, and budgets using the financial context provided above.
                - Give practical, actionable budgeting and saving advice.
                - Be concise — keep responses under 150 words unless the user asks for detail.
                - Be encouraging and positive, not judgmental about spending.
                - If asked something unrelated to finance, politely redirect to finance topics.
                - Always refer to amounts in LKR.

                Do not make up transaction details you don't have. If you don't know something specific, say so.
                """.formatted(contextInfo);

        List<Map<String, String>> chatMessages = new ArrayList<>();
        chatMessages.add(Map.of("role", "system", "content", systemPrompt));

        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            chatMessages.addAll(request.getMessages());
        } else if (request.getMessage() != null && !request.getMessage().isBlank()) {
            chatMessages.add(Map.of("role", "user", "content", request.getMessage().trim()));
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", GROQ_MODEL);
        payload.put("messages", chatMessages);
        payload.put("max_tokens", 300);
        payload.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GROQ_API_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, String> message = (Map<String, String>) firstChoice.get("message");
                    if (message != null && message.get("content") != null) {
                        return message.get("content");
                    }
                }
            }
            return "Sorry, I couldn't generate a response at this time.";
        } catch (Exception e) {
            log.error("Failed to query Groq AI API: {}", e.getMessage(), e);
            throw new RuntimeException("AI Assistant is currently unavailable: " + e.getMessage());
        }
    }
}
