package passwordmanager.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
//@Table (name = "User")
@Data
public class User {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String username;

    @Column
    private String password;

    @Column
    private String salt;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<StoredPassword> storedPasswords;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PasswordReset> passwordResets;
}
