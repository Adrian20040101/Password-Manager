package passwordmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import passwordmanager.model.StoredPassword;
import passwordmanager.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername (String username);

    @Query("select sp from StoredPassword sp where sp.user.id = :id")
    List<StoredPassword> findUserPasswords (@Param("id") Integer id);
}
