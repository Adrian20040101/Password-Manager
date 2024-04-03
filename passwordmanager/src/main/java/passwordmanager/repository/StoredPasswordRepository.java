package passwordmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import passwordmanager.model.StoredPassword;

import java.util.List;

@Repository
public interface StoredPasswordRepository extends JpaRepository<StoredPassword, Integer> {

    List<StoredPassword> findByUserId (Integer id);
}
