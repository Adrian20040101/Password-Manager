package passwordmanager.service;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import passwordmanager.custom_exceptions.*;
import passwordmanager.model.StoredPassword;
import passwordmanager.model.User;
import passwordmanager.model.UserSession;
import passwordmanager.repository.UserRepository;

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

    public void saveNewUser (User user) {
        if (!isComplex(user.getPassword())) {
            throw new NotComplexEnoughException("Password does not meet required criteria.");
        }
        String salt = BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(user.getPassword(), salt);
        user.setPassword(hashedPassword);
        user.setSalt(salt);
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
        String salt = BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(newPassword, salt);
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            user.setPassword(hashedPassword);
            user.setSalt(salt);
            repository.save(user);
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public String retrievePassword (Integer id) {
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            return user.getPassword();
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public String retrieveSalt(Integer id) {
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            return user.getSalt();
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
    }

    public List<StoredPassword> retrieveUserInformation (Integer id) {

        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            return repository.findUserPasswords(id);
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
            String storedPassword = retrievePassword(user.getId());
            String storedSalt = retrieveSalt(user.getId());
            String hashedPassword = BCrypt.hashpw(password, storedSalt);
            if (hashedPassword.equals(storedPassword)) {
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
