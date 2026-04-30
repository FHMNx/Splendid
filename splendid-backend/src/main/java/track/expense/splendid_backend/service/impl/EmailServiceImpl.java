package track.expense.splendid_backend.service.impl;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import track.expense.splendid_backend.service.EmailService;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final SpringTemplateEngine templateEngine;

    @Value("${sendgrid.api.key}")
    private String API_KEY;

    @Value("${app.logo.url}")
    private String LOGO_URL;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void sendVerificationEmail(String to, String name, String token) {
        try {
            log.info("Sending verification email to: {}", to);
            String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("verifyUrl", verificationLink);
            context.setVariable("logoUrl", LOGO_URL);

            String htmlContent = templateEngine.process("email/verification-email", context);

            sendHtmlEmail(to, "Verify Your Email - Splendid", htmlContent);
            log.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    public void sendPasswordResetEmail(String to, String name, String token) {
        try {
            log.info("Sending password reset email to: {}", to);
            String resetLink = frontendUrl + "/reset-password?token=" + token;

            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("resetLink", resetLink);
            context.setVariable("logoUrl", LOGO_URL);

            String html = templateEngine.process("email/reset-password-email", context);

            sendHtmlEmail(to, "Reset Your Password - Splendid", html);
            log.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {

        String fromEmail = "fahmaanx@gmail.com";

        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/html", htmlContent);

        Mail mail = new Mail(from, subject, toEmail, content);
        SendGrid sg = new SendGrid(API_KEY);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to send email", ex);
        }
    }
}