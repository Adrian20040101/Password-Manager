package passwordmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
//@Table (name = "StoredPassword")
@Data
public class StoredPassword {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn (name = "userId", nullable = false)
    @JsonIgnore
    private User user;
    @Column
    private String website;
    @Column
    private String storedPassword;
    @Column
    private String salt;
}
