package com.example.notification_service.service;

import com.example.common.dto.OrderNotificationRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Properties;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    @Autowired
    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmationEmail(OrderNotificationRequest request) {
        String subject = "Potwierdzenie zakupu";
        String message = String.format("Drogi kliencie,\n\nDziękujemy za zakup %s.\nSzczegóły dostawy:\n%s\n\nCena: %s\n",
                request.getProductName(),
                request.getDeliveryDetails(),
                request.getTotalPrice());
        sendEmail(request.getBuyerEmail(), subject, message);
    }

    public void sendOrderSoldNotification(OrderNotificationRequest request) {
        String subject = "Produkt sprzedany!";
        String message = String.format("Twój produkt %s został sprzedany!\nSzczegóły dostawy:\n%s\n\nCena: %s\n",
                request.getProductName(),
                request.getDeliveryDetails(),
                request.getTotalPrice());
        sendEmail(request.getSellerEmail(), subject, message);
    }

    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, StandardCharsets.UTF_8.name());

            // Konfiguracja wiadomości e-mail
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, false); // false -> wiadomość tekstowa (nie HTML)

            // Wysłanie wiadomości
            mailSender.send(message);
            System.out.println("Email sent successfully with UTF-8 encoding!");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}
