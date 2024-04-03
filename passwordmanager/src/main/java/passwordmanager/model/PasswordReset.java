package passwordmanager.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
//@Table (name = "PasswordReset")
@Data
public class PasswordReset {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String email;

    @ManyToOne
    @JoinColumn (name = "userId")
    private User user;

    @Column
    private String token;

    @Column
    private LocalDateTime expirationTime;

    public void setExpirationTime () {
        this.expirationTime = LocalDateTime.now().plusMinutes(10);
    }

    public enum Status {
        PENDING,
        USED,
        EXPIRED
    }

    @Column
    private Status status;
}
