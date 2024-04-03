package passwordmanager.custom_exceptions;

public class NotComplexEnoughException extends RuntimeException {
    public NotComplexEnoughException (String message) {
        super(message);
    }
}
