package passwordmanager.custom_exceptions;

public class AlreadySolvedException extends RuntimeException {
    public AlreadySolvedException (String message) {
        super(message);
    }
}
