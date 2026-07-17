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