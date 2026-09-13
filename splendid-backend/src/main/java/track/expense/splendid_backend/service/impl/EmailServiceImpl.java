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

    @Override
    public void sendTicketCreatedEmail(String toEmail, String userName, String ticketNumber, String subject) {
        String safeName = (userName != null && !userName.isBlank()) ? userName : "there";
        String ticketUrl = frontendUrl + "/dashboard/support";
        String html = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<img src=\"" + LOGO_URL + "\" alt=\"Splendid Logo\" style=\"height: 50px;\" />"
                + "<h2 style=\"color: #059669; margin-top: 10px;\">Support Ticket Received</h2>"
                + "</div>"
                + "<p>Hi " + safeName + ",</p>"
                + "<p>Your support ticket <strong>#" + ticketNumber + "</strong> has been received and logged into our system.</p>"
                + "<div style=\"background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb;\">"
                + "<p style=\"margin: 0 0 8px 0; font-size: 14px;\"><strong>Ticket ID:</strong> #" + ticketNumber + "</p>"
                + "<p style=\"margin: 0; font-size: 14px;\"><strong>Subject:</strong> " + subject + "</p>"
                + "</div>"
                + "<p>Our support team is reviewing your request and will post an update shortly.</p>"
                + "<div style=\"text-align: center; margin: 25px 0;\">"
                + "<a href=\"" + ticketUrl + "\" style=\"background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">View Ticket in Dashboard</a>"
                + "</div>"
                + "<p>Best regards,<br/><strong>The Splendid Support Team</strong></p>"
                + "</div>";

        sendHtmlEmail(toEmail, "[Ticket #" + ticketNumber + "] Support Ticket Created: " + subject, html);
    }

    @Override
    public void sendTicketReplyEmail(String toEmail, String userName, String ticketNumber, String replyPreview) {
        String safeName = (userName != null && !userName.isBlank()) ? userName : "there";
        String ticketUrl = frontendUrl + "/dashboard/support";
        String html = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<img src=\"" + LOGO_URL + "\" alt=\"Splendid Logo\" style=\"height: 50px;\" />"
                + "<h2 style=\"color: #059669; margin-top: 10px;\">New Reply to Your Ticket</h2>"
                + "</div>"
                + "<p>Hi " + safeName + ",</p>"
                + "<p>A support agent has replied to your ticket <strong>#" + ticketNumber + "</strong>:</p>"
                + "<div style=\"background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669;\">"
                + "<p style=\"white-space: pre-wrap; margin: 0; color: #166534; font-size: 14px;\">" + replyPreview + "</p>"
                + "</div>"
                + "<div style=\"text-align: center; margin: 25px 0;\">"
                + "<a href=\"" + ticketUrl + "\" style=\"background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">View & Reply in Dashboard</a>"
                + "</div>"
                + "<p>Best regards,<br/><strong>The Splendid Support Team</strong></p>"
                + "</div>";

        sendHtmlEmail(toEmail, "[Ticket #" + ticketNumber + "] New Reply from Support Team", html);
    }

    @Override
    public void sendAdminTicketAlertEmail(String ticketNumber, String subject) {
        String adminUrl = frontendUrl + "/admin/tickets";
        String html = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                + "<img src=\"" + LOGO_URL + "\" alt=\"Splendid Logo\" style=\"height: 50px;\" />"
                + "<h2 style=\"color: #059669; margin-top: 10px;\">New Ticket Alert</h2>"
                + "</div>"
                + "<p>A user has opened a new support ticket:</p>"
                + "<table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px;\">"
                + "<tr><td style=\"padding: 8px 0; font-weight: bold; width: 130px; color: #374151;\">Ticket Number:</td><td>#" + ticketNumber + "</td></tr>"
                + "<tr><td style=\"padding: 8px 0; font-weight: bold; color: #374151;\">Subject:</td><td>" + subject + "</td></tr>"
                + "</table>"
                + "<div style=\"text-align: center; margin: 25px 0;\">"
                + "<a href=\"" + adminUrl + "\" style=\"background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Open Admin Ticket Desk</a>"
                + "</div>"
                + "</div>";

        sendHtmlEmail(adminEmail, "[Admin Alert] New Ticket #" + ticketNumber + ": " + subject, html);
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