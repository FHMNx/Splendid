package track.expense.splendid_backend.service.impl;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import track.expense.splendid_backend.service.EmailService;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Value("${sendgrid.api.key}")
    private String API_KEY;

    @Value("${app.logo.url}")
    private String LOGO_URL;

    private final TemplateEngine templateEngine;

    @Override
    public void sendVerificationEmail(String to, String name, String token) {

        String fromEmail = "fahmaanx@gmail.com";
        String subject = "Verify Your Email - Splendid";

        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("verifyUrl", verificationLink);
        context.setVariable("logoUrl", LOGO_URL);

        String htmlContent = templateEngine.process("email/verification-email", context);

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

            Response response = sg.api(request);

            System.out.println("Email Status Code: " + response.getStatusCode());

        } catch (Exception ex) {
            throw new RuntimeException("Failed to send email", ex);
        }
    }
}