package track.expense.splendid_backend.service.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import track.expense.splendid_backend.service.EmailService;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender mailSender;

    @Value("${app.logo.url}")
    private String LOGO_URL;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.email.sender}")
    private String fromEmail;

    @Value("${app.admin.email:support@moonfleet.lk}")
    private String adminEmail;

    @Override
    public void sendVerificationEmail(String to, String name, String token) {
        String verificationLink = frontendUrl + "/verify?token=" + token;
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("verifyUrl", verificationLink);
        context.setVariable("logoUrl", LOGO_URL);

        String htmlContent = templateEngine.process("email/verification-email", context);
        sendHtmlEmail(to, "Verify Your Email - Splendid", htmlContent);
    }

    @Override
    public void sendPasswordResetEmail(String to, String name, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("resetLink", resetLink);
        context.setVariable("logoUrl", LOGO_URL);

        String html = templateEngine.process("email/reset-password-email", context);
        sendHtmlEmail(to, "Reset Your Password - Splendid", html);
    }

    @Override
    public void sendContactConfirmationEmail(String userEmail, String userName, String subject) {
        String safeName = (userName != null && !userName.isBlank()) ? userName : "there";
        String html = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<img src=\"" + LOGO_URL + "\" alt=\"Splendid Logo\" style=\"height: 50px;\" />"
                + "<h2 style=\"color: #059669; margin-top: 10px;\">We've Received Your Message</h2>"
                + "</div>"
                + "<p>Hi " + safeName + ",</p>"
                + "<p>Thank you for reaching out to <strong>Splendid Support</strong>. We have received your inquiry regarding <strong>\"" + subject + "\"</strong>.</p>"
                + "<p>Our support team is reviewing your message and will get back to you as soon as possible.</p>"
                + "<div style=\"background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669;\">"
                + "<p style=\"margin: 0; color: #166534; font-size: 14px;\">If you have any further details or updates to provide, please reply directly to this email.</p>"
                + "</div>"
                + "<p>Best regards,<br/><strong>The Splendid Team</strong></p>"
                + "</div>";

        sendHtmlEmail(userEmail, "We received your message - Splendid Support", html);
    }

    @Override
    public void sendAdminContactNotification(String userEmail, String userName, String subject, String message) {
        String safeName = (userName != null && !userName.isBlank()) ? userName : "User";
        String html = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<img src=\"" + LOGO_URL + "\" alt=\"Splendid Logo\" style=\"height: 50px;\" />"
                + "<h2 style=\"color: #059669; margin-top: 10px;\">New Support Inquiry</h2>"
                + "</div>"
                + "<table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px;\">"
                + "<tr><td style=\"padding: 8px 0; font-weight: bold; width: 130px; color: #374151;\">User Name:</td><td>" + safeName + "</td></tr>"
                + "<tr><td style=\"padding: 8px 0; font-weight: bold; color: #374151;\">User Email:</td><td><a href=\"mailto:" + userEmail + "\" style=\"color: #059669;\">" + userEmail + "</a></td></tr>"
                + "<tr><td style=\"padding: 8px 0; font-weight: bold; color: #374151;\">Subject:</td><td>" + subject + "</td></tr>"
                + "</table>"
                + "<div style=\"background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;\">"
                + "<h4 style=\"margin-top: 0; margin-bottom: 8px; color: #111827;\">Message:</h4>"
                + "<p style=\"white-space: pre-wrap; margin: 0; color: #374151;\">" + message + "</p>"
                + "</div>"
                + "</div>";

        sendHtmlEmail(adminEmail, "[Splendid Support] Inquiry from " + safeName + ": " + subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Email successfully sent to " + to + " via SendGrid Port 2525!");

        } catch (Exception ex) {
            System.out.println("Failed to send email: " + ex.getMessage());
            throw new RuntimeException("Failed to send email", ex);
        }
    }
}