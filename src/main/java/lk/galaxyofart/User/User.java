package lk.galaxyofart.User;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.galaxyofart.employee.Employee;
import lk.galaxyofart.privilage.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // To identify this class as Database table
@Table(name = "user_table") // Specify Database table name

@Data // to create getters and setters
@AllArgsConstructor // create all argument constructor
@NoArgsConstructor // create default constructor


@JsonInclude(JsonInclude.Include.NON_NULL) // to ignore null values in the response

public class User {

    @Id // PRIMARY KEY
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO INCREMENT
    private Integer id;

    @Column(name = "username", unique = true) // values are unique
    @NotNull // No null values
    private String username;

    @NotNull
    private String password;

    @Column(name = "useremail", unique = true)
    @NotNull
    private String useremail;

    @NotNull
    private Boolean status;

    @NotNull
    private LocalDateTime addeddatetime;

    private LocalDateTime updateddatetime;

    private LocalDateTime deleteddatetime;

    private String note;

    private byte[] user_photo;

    @ManyToOne(optional = true) // user & employee has many to one relationship. employee_table_id is the join column.
    @JoinColumn(name = "employee_table_id", referencedColumnName = "id") // Specifies the foreign key column and its
    private Employee employee_table_id;

    @ManyToMany(cascade = CascadeType.MERGE) // user & roles has many to many relationship. user_table_has_role_table the joint table. user_table_id is the join column and roles_table_id is the inverse join column.
    @JoinTable(name = "user_table_has_role_table", joinColumns = @JoinColumn(name = "user_table_id"), inverseJoinColumns = @JoinColumn(name = "role_table_id"))
    private Set<Roles> roles;

    public User(Integer id, String username, String useremail, Employee employee_table_id, Boolean status) { //constructor  // to get selected columns from the database
                                                                                                             
        this.id = id;
        this.username = username;
        this.useremail = useremail;
        this.employee_table_id = employee_table_id;
        this.status = status;
    }

   
}
