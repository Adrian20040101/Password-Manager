package passwordmanager.service;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        }
    }

    public String generateToken () {
        return UUID.randomUUID().toString();
    }
}
