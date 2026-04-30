package track.expense.splendid_backend.dto;
  import jakarta.validation.constraints.NotBlank;
  import jakarta.validation.constraints.Size;
  import lombok.Data;
  @Data
  public class ResetPasswordRequestDto {
      @NotBlank
      private String token;
      @NotBlank @Size(min = 6)
      private String password;
  }
