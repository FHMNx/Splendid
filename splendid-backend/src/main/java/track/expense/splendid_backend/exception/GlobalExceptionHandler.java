package track.expense.splendid_backend.exception;
  import org.springframework.http.HttpStatus;
  import org.springframework.http.ResponseEntity;
  import org.springframework.web.bind.MethodArgumentNotValidException;
  import org.springframework.web.bind.annotation.ExceptionHandler;
  import org.springframework.web.bind.annotation.RestControllerAdvice;
  import track.expense.splendid_backend.dto.ErrorResponse;
  import java.time.LocalDateTime;

  @RestControllerAdvice
  public class GlobalExceptionHandler {

      private ResponseEntity<ErrorResponse> build(String message, HttpStatus status) {
          return ResponseEntity.status(status).body(
              ErrorResponse.builder()
                  .message(message)
                  .status(status.value())
                  .timestamp(LocalDateTime.now())
                  .build()
          );
      }

      @ExceptionHandler(UserNotFoundException.class)
      public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
          return build(ex.getMessage(), HttpStatus.NOT_FOUND);
      }

      @ExceptionHandler(InvalidTokenException.class)
      public ResponseEntity<ErrorResponse> handleInvalidToken(InvalidTokenException ex) {
          return build(ex.getMessage(), HttpStatus.BAD_REQUEST);
      }

      @ExceptionHandler(EmailAlreadyExistsException.class)
      public ResponseEntity<ErrorResponse> handleEmailExists(EmailAlreadyExistsException ex) {
          return build(ex.getMessage(), HttpStatus.CONFLICT);
      }

      @ExceptionHandler(EmailNotVerifiedException.class)
      public ResponseEntity<ErrorResponse> handleEmailNotVerified(EmailNotVerifiedException ex) {
          return build(ex.getMessage(), HttpStatus.FORBIDDEN);
      }

      @ExceptionHandler(MethodArgumentNotValidException.class)
      public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
          String message = ex.getBindingResult().getFieldErrors().stream()
              .map(e -> e.getField() + ": " + e.getDefaultMessage())
              .findFirst()
              .orElse("Validation failed");
          return build(message, HttpStatus.BAD_REQUEST);
      }

      @ExceptionHandler(RuntimeException.class)
      public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
          return build(ex.getMessage(), HttpStatus.BAD_REQUEST);
      }

      @ExceptionHandler(Exception.class)
      public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
          return build("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
