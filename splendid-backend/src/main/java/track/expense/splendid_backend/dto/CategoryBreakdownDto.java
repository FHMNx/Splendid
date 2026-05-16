package track.expense.splendid_backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryBreakdownDto {
    private String name;
    private double value;
}
