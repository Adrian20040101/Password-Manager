package passwordmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import passwordmanager.custom_exceptions.IncorrectCredentialsException;
import passwordmanager.custom_exceptions.NotComplexEnoughException;
import passwordmanager.custom_exceptions.UserAlreadyLoggedInException;
import passwordmanager.custom_exceptions.UserNotFoundException;
import passwordmanager.model.User;
import passwordmanager.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/save")
    public ResponseEntity<HttpStatus> saveNewUser(@RequestBody User user) {
        try {
            service.saveNewUser(user);
            return ResponseEntity.ok(HttpStatus.CREATED);
        } catch (NotComplexEnoughException e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<HttpStatus> deleteUser(@RequestParam Integer id) {
        try {
            service.deleteUser(id);
            return ResponseEntity.ok(HttpStatus.GONE);
        }catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/change")
    public ResponseEntity<HttpStatus> changePassword(@RequestParam Integer id, @RequestParam String newPassword) {
        try {
            service.changePassword(id, newPassword);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (NotComplexEnoughException e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/retrieve")
    public ResponseEntity<?> retrievePassword(@RequestParam Integer id) {
        try {
            return ResponseEntity.ok(service.retrievePassword(id));
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        try {
            return ResponseEntity.ok(service.login(username, password));
        } catch (UserAlreadyLoggedInException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IncorrectCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<HttpStatus> logout() {
        try {
            boolean isLoggedOut = service.logout();
            if (isLoggedOut) {
                return ResponseEntity.ok(HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}