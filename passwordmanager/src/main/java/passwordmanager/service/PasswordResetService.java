package passwordmanager.service;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import passwordmanager.custom_exceptions.PasswordNotFoundException;
import passwordmanager.custom_exceptions.UserNotFoundException;
import passwordmanager.model.PasswordReset;
import passwordmanager.model.User;
import passwordmanager.repository.PasswordResetRepository;
import passwordmanager.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordResetRepository passwordResetRepository;

    @Autowired
    EmailService emailService;

    public void initiatePasswordReset (String username, String email) throws MessagingException {
        Optional<User> foundUser = userRepository.findByUsername(username);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            Optional<PasswordReset> existingResetRequest = passwordResetRepository.findByUserIdAndStatus(user.getId(), PasswordReset.Status.PENDING);
            if (existingResetRequest.isPresent()) {
                throw new IllegalStateException("User already has a pending password reset request.");
            }

            String token = generateToken();
            PasswordReset reset = new PasswordReset();
            reset.setUser(user);
            reset.setEmail(email);
            reset.setToken(token);
            reset.setExpirationTime(LocalDateTime.now().plusMinutes(10));
            reset.setStatus(PasswordReset.Status.PENDING);
            user.getPasswordResets().add(reset);
            passwordResetRepository.save(reset);

            String resetLink = "http://localhost:3000/reset-password?token=" + token + '/' + user.getId();
            emailService.sendPasswordResetEmail(email, resetLink);
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }

    public void checkForValidity (Integer resetId) {
        Optional<PasswordReset> foundResetEntry = passwordResetRepository.findById(resetId);
        if (foundResetEntry.isPresent()) {
            PasswordReset reset = foundResetEntry.get();
            if (reset.getStatus().equals(PasswordReset.Status.PENDING)) {
                LocalDateTime expirationTime = reset.getExpirationTime();
                LocalDateTime currentTime = LocalDateTime.now();
                if (currentTime.isAfter(expirationTime)) {
                    reset.setStatus(PasswordReset.Status.EXPIRED);
                    passwordResetRepository.save(reset);
                }
            } else {
                throw new IllegalStateException("Session has already been completed or has expired.");
            }
        } else {
            throw new PasswordNotFoundException("Password reset entry with ID " + resetId + " was not found.");
        }
    }

    public String generateToken () {
        return UUID.randomUUID().toString();
    }
}
