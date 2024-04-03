package passwordmanager.model;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class UserSession {
    private static User currentUser = null;

    public static void login(User user) {
        currentUser = user;
    }

    public static void logout() {
        currentUser = null;
    }

    public static boolean isLoggedIn() {
        return currentUser != null;
    }

    public static User getLoggedInUser() {
        return currentUser;
    }

}
