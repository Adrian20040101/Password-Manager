package passwordmanager.controller;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import passwordmanager.service.PasswordResetService;

@RestController
@RequestMapping("/reset")
@CrossOrigin
public class PasswordResetController {

    @Autowired
    PasswordResetService service;

    @PostMapping("/passwordReset")
    public String initiatePasswordReset(@RequestParam String username, @RequestParam String email) {
        try {
            service.initiatePasswordReset(username, email);
            return "Password reset initiated successfully!";
        } catch (MessagingException e) {
            return "Failed to initiate password reset: " + e.getMessage();
        }
    }
}
