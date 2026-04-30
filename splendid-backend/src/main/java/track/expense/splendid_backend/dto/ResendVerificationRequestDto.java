package track.expense.splendid_backend.dto;
  import jakarta.validation.constraints.Email;
  import jakarta.validation.constraints.NotBlank;
  import lombok.Data;
  @Data
  public class ResendVerificationRequestDto {
      @NotBlank @Email
      private String email;
  }
