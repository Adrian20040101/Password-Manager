package passwordmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import passwordmanager.custom_exceptions.PasswordNotFoundException;
import passwordmanager.custom_exceptions.UserNotFoundException;
import passwordmanager.key_retrieval.KeyRetrieval;
import passwordmanager.model.StoredPassword;
import passwordmanager.model.User;
import passwordmanager.repository.StoredPasswordRepository;
import passwordmanager.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StoredPasswordService {

    @Autowired
    private StoredPasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    private final KeyRetrieval keyRetrievalService;

    public StoredPasswordService(KeyRetrieval keyRetrievalService) {
        this.keyRetrievalService = keyRetrievalService;
    }

    public void addPassword (Integer id, String website, String password) {
        String encryptedPassword = keyRetrievalService.encryptPassword(password);
        Optional<User> foundUser = userRepository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            StoredPassword storedPassword = new StoredPassword();
            storedPassword.setWebsite(website);
            storedPassword.setStoredPassword(encryptedPassword);
            storedPassword.setUser(user);
            passwordRepository.save(storedPassword);

            // update the user as well to reflect the changes in the storedPassword list
            user.getStoredPasswords().add(storedPassword);
            userRepository.save(user);
        } else {
            throw new UserNotFoundException("User with ID " + id + " was not found.");
        }
    }

    public void deletePassword (Integer userId, Integer passwordId) {
        Optional<User> foundUser = userRepository.findById(userId);
        Optional<StoredPassword> foundPassword = passwordRepository.findById(passwordId);

        if (foundUser.isPresent()) {
            User user = foundUser.get();
            if (foundPassword.isPresent()) {
                StoredPassword storedPassword = foundPassword.get();
                user.getStoredPasswords().remove(storedPassword);
                passwordRepository.deleteById(passwordId);
                userRepository.save(user);
            } else {
                throw new PasswordNotFoundException("Password Entry with ID " + passwordId + " was not found.");
            }
        } else {
            throw new UserNotFoundException("User with ID " + userId + " was not found.");
        }
    }

    public void deletePasswordsByUserId(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<StoredPassword> passwordsToDelete = passwordRepository.findByUserId(id);
            passwordRepository.deleteAll(passwordsToDelete);
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found");
        }
    }

    public void changePassword (Integer userId, Integer passwordId, String newPassword) {
        Optional<User> foundUser = userRepository.findById(userId);
        Optional<StoredPassword> foundPassword = passwordRepository.findById(passwordId);

        if (foundUser.isPresent()) {
            User user = foundUser.get();
            if (foundPassword.isPresent()) {
                StoredPassword storedPassword = foundPassword.get();
                String encryptedPassword = keyRetrievalService.encryptPassword(newPassword);
                storedPassword.setStoredPassword(encryptedPassword);
                passwordRepository.save(storedPassword);
            } else {
                throw new PasswordNotFoundException("Password Entry with ID " + passwordId + " was not found.");
            }
        } else {
            throw new UserNotFoundException("User with ID " + userId + " was not found.");
        }
    }

    public Map<String, String> retrievePassword(Integer userId, Integer passwordId) {
        Optional<User> foundUser = userRepository.findById(userId);
        Optional<StoredPassword> foundPassword = passwordRepository.findById(passwordId);

        if (foundUser.isPresent()) {
            User user = foundUser.get();
            if (foundPassword.isPresent()) {
                StoredPassword storedPassword = foundPassword.get();
                String website = storedPassword.getWebsite();
                String encryptedPassword = storedPassword.getStoredPassword();
                String decryptedPassword = keyRetrievalService.decryptPassword(encryptedPassword);
                Map<String, String> passwordInfo = new HashMap<>();
                passwordInfo.put("website", website);
                passwordInfo.put("password", decryptedPassword);
                return passwordInfo;
            } else {
                throw new PasswordNotFoundException("Password Entry with ID " + passwordId + " was not found.");
            }
        } else {
            throw new UserNotFoundException("User with ID " + userId + " was not found.");
        }
    }

}
