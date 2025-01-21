package com.example.notification_service.controller;

import com.example.common.dto.OrderNotificationRequest;
import com.example.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/order-confirmation")
    public void sendOrderConfirmation(@RequestBody OrderNotificationRequest request) {
        notificationService.sendOrderConfirmationEmail(request);
    }

    @PostMapping("/order-sold")
    public void sendOrderSoldNotification(@RequestBody OrderNotificationRequest request) {
        notificationService.sendOrderSoldNotification(request);
    }

    @PostMapping("/test-email")
    public String testEmail() {
        try {
            notificationService.sendEmail("kuba.kadlubowski@gmail.com", "Test Email", "This is a test email from NotificationService.");
            return "Test email sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/test-polish-email")
    public String testPolishEmail() {
        try {
            String content = "Wiadomość testowa z polskimi znakami: ąęśćółżźń";
            notificationService.sendEmail(
                    "kuba.kadlubowski@gmail.com",
                    "Test polskich znaków",
                    content
            );
            return "Email with Polish characters sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
