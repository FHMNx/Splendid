package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.AiChatRequestDto;

public interface AiProxyService {

    String generateChatResponse(AiChatRequestDto request);
}
