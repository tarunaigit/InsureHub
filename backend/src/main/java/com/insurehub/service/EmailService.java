package com.insurehub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRenewalReminder(
            String recipientEmail,
            String customerName,
            String policyNumber,
            String planName,
            String expiryDate
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(recipientEmail);

        message.setSubject(
                "Your InsureHub policy is due for renewal"
        );

        message.setText(
                "Hello " + customerName + ",\n\n" +

                "This is a reminder from InsureHub that your " +
                planName + " insurance policy is due for renewal.\n\n" +

                "Policy Number: " + policyNumber + "\n" +
                "Expiry Date: " + expiryDate + "\n\n" +

                "Your policy will expire in approximately one month. " +
                "Please log in to your InsureHub account and renew your " +
                "policy to continue your coverage.\n\n" +

                "Thank you for choosing InsureHub.\n\n" +

                "Regards,\n" +
                "InsureHub\n" +
                "Insurance Policy Management System"
        );

        mailSender.send(message);
    }
}