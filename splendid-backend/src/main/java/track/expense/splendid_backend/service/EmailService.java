package track.expense.splendid_backend.service;

public interface EmailService {
    void sendVerificationEmail(String to, String name, String token);
    void sendPasswordResetEmail(String to, String name, String token);
}
