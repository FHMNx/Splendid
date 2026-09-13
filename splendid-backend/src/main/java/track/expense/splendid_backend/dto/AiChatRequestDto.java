package track.expense.splendid_backend.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequestDto {

    private String message;
    private String currentContext;
    private List<Map<String, String>> messages;
}
