package passwordmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import passwordmanager.model.PasswordReset;

import java.util.List;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Integer> {
    Optional<PasswordReset> findByUserIdAndStatus(Integer userId, PasswordReset.Status status);
    List<PasswordReset> findByStatus(PasswordReset.Status status);

}
