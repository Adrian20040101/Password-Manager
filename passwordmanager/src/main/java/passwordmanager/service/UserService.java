package passwordmanager.service;

import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import passwordmanager.custom_exceptions.*;
import passwordmanager.model.PasswordReset;
import passwordmanager.model.StoredPassword;
import passwordmanager.model.User;
import passwordmanager.model.UserSession;
import passwordmanager.repository.PasswordResetRepository;
import passwordmanager.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private StoredPasswordService passwordService;

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    private final BasicTextEncryptor encryptor;

    public UserService () {
        String encryptionPassword = readKey();
        encryptor = new BasicTextEncryptor();
        encryptor.setPassword(encryptionPassword);
    }

    private String readKey (){
        try {
            return Files.readString(Path.of("passwordmanager/encryption_key.txt")).trim();
        } catch (IOException e) {
            return "Error fetching key.";
        }
    }

    public void saveNewUser (User user) {
        if (!isComplex(user.getPassword())) {
            throw new NotComplexEnoughException("Password does not meet required criteria.");
        }
        String encryptedPassword = encryptor.encrypt(user.getPassword());
        user.setPassword(encryptedPassword);
        repository.save(user);
    }

    @Transactional
    public void deleteUser (Integer id) {
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            passwordService.deletePasswordsByUserId(id);
            repository.deleteById(id);
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public void changePassword (Integer id, String newPassword) {
        if (!isComplex(newPassword)) {
            throw new NotComplexEnoughException("Password does not meet required criteria.");
        }
        String encryptedPassword = encryptor.encrypt(newPassword);
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            user.setPassword(encryptedPassword);
            repository.save(user);
            Optional<PasswordReset> foundResetRequest = passwordResetRepository.findByUserIdAndStatus(user.getId(), PasswordReset.Status.PENDING);
            if (foundResetRequest.isPresent()) {
                PasswordReset resetRequest = foundResetRequest.get();
                resetRequest.setStatus(PasswordReset.Status.SOLVED);
                passwordResetRepository.save(resetRequest);
            }
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public String retrieveUserPassword (Integer id) {
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            return encryptor.decrypt(user.getPassword());
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public List<StoredPassword> retrieveUserInformation (Integer id) {

        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            List<StoredPassword> encryptedPasswords = repository.findUserPasswords(id);
            List<StoredPassword> decryptedPasswords = new ArrayList<>();
            for (var encryptedPassword : encryptedPasswords) {
                StoredPassword decryptedPassword = new StoredPassword();
                decryptedPassword.setId(encryptedPassword.getId());
                decryptedPassword.setWebsite(encryptedPassword.getWebsite());
                decryptedPassword.setUser(encryptedPassword.getUser());
                String decryptedPasswordValue = encryptor.decrypt(encryptedPassword.getStoredPassword());
                decryptedPassword.setStoredPassword(decryptedPasswordValue);
                decryptedPasswords.add(decryptedPassword);
            }
            return decryptedPasswords;
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public Integer login(String username, String password) {
        if (UserSession.isLoggedIn()) {
            throw new UserAlreadyLoggedInException("User is already logged in with another account.");
        }

        Optional<User> foundUser = repository.findByUsername(username);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            String decryptedPassword = encryptor.decrypt(user.getPassword());
            if (decryptedPassword.equals(password)) {
                UserSession.login(user);
                return user.getId();
            } else {
                throw new IncorrectCredentialsException("Incorrect username or password.");
            }
        } else {
            throw new UserNotFoundException("User not found.");
        }
    }


    public boolean logout () {
        if (UserSession.isLoggedIn()) {
            UserSession.logout();
            return true;
        }
        throw new NoUserLoggedInException("No user is logged in.");
    }

    // check if the introduced password matches the given criteria:
    // at least one digit
    // at least one capital letter
    // at least one special character
    // at least 8 characters, at most 16 characters
    public boolean isComplex (String password) {
        if (password.length() < 8 || password.length() > 16)
            return false;
        return Pattern.compile("^(?=.*[0-9])(?=.*[A-Z])(?=.*[*&^!?/.']).+$").matcher(password).find();
    }
}
