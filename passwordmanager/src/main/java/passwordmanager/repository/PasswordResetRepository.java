package passwordmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import passwordmanager.model.PasswordReset;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Integer> {

}
