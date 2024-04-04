package passwordmanager.controller;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import passwordmanager.service.PasswordResetService;

@RestController
@RequestMapping("/reset")
@CrossOrigin
public class PasswordResetController {

    @Autowired
    PasswordResetService service;

    @PostMapping("/passwordReset")
    public ResponseEntity<HttpStatus> initiatePasswordReset(@RequestParam String username, @RequestParam String email) {
        try {
            service.initiatePasswordReset(username, email);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
