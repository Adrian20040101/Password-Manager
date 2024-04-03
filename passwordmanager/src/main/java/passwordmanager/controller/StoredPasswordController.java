package passwordmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import passwordmanager.custom_exceptions.PasswordNotFoundException;
import passwordmanager.custom_exceptions.UserNotFoundException;
import passwordmanager.service.StoredPasswordService;
import passwordmanager.service.UserService;

@RestController
@RequestMapping("/password")
@CrossOrigin
public class StoredPasswordController {

    @Autowired
    private StoredPasswordService service;

    @Autowired
    private UserService userService;

    @PostMapping("/savePassword")
    public ResponseEntity<HttpStatus> addPassword(@RequestParam Integer id, @RequestParam String website, @RequestParam String password) {
        try {
            service.addPassword(id, website, password);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deletePassword")
    public ResponseEntity<?> deletePassword(@RequestParam Integer userId, @RequestParam Integer passwordId) {
        try {
            service.deletePassword(userId, passwordId);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (PasswordNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password not found.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deleteAllByUser")
    public ResponseEntity<HttpStatus> deleteAllPasswordsByUserId(@RequestParam Integer id) {
        try {
            service.deletePasswordsByUserId(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam Integer userId, @RequestParam Integer passwordId, @RequestParam String newPassword) {
        try {
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (PasswordNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password not found.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/retrievePassword")
    public ResponseEntity<?> retrievePassword(@RequestParam Integer userId, @RequestParam Integer passwordId) {
        try {
            return ResponseEntity.ok(service.retrievePassword(userId, passwordId));
        } catch (PasswordNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password not found.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/retrieveAll")
    public ResponseEntity<?> retrieveUserInfo(@RequestParam Integer id) {
        try {
            return ResponseEntity.ok(userService.retrieveUserInformation(id));
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
