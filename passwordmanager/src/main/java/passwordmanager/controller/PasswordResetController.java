package passwordmanager.controller;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import passwordmanager.custom_exceptions.PasswordNotFoundException;
import passwordmanager.custom_exceptions.UserNotFoundException;
import passwordmanager.service.PasswordResetService;

@RestController
@RequestMapping("/reset")
@CrossOrigin
public class PasswordResetController {

    @Autowired
    PasswordResetService service;

    @GetMapping("/checkValidity")
    public ResponseEntity<?> checkPasswordResetValidity(@RequestParam("resetId") Integer resetId) {
        try {
            service.checkForValidity(resetId);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (PasswordNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/passwordReset")
    public ResponseEntity<HttpStatus> initiatePasswordReset(@RequestParam String username, @RequestParam String email) {
        try {
            service.initiatePasswordReset(username, email);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
