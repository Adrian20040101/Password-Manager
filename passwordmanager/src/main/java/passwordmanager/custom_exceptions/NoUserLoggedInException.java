package passwordmanager.custom_exceptions;

public class NoUserLoggedInException extends RuntimeException {
    public NoUserLoggedInException (String message) {
        super(message);
    }
}
