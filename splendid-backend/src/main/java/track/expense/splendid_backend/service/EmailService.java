package track.expense.splendid_backend.service;

public interface EmailService {
    void sendVerificationEmail(String to, String name, String token);
    void sendPasswordResetEmail(String to, String name, String token);
    void sendContactConfirmationEmail(String userEmail, String userName, String subject);
    void sendAdminContactNotification(String userEmail, String userName, String subject, String message);
}
