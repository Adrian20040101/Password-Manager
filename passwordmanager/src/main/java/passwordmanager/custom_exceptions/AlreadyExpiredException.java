package passwordmanager.custom_exceptions;

public class AlreadyExpiredException extends RuntimeException {
    public AlreadyExpiredException (String message) {
        super(message);
    }
}
