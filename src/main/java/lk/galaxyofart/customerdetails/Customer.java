package lk.galaxyofart.customerdetails;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//Specifies that the class is an entity
@Entity
@Table(name = "customerdetails") // specifies the primary table

@Data // setter, getter
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // empty constructor
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Customer {

    @Id // Identifies the primary key of an entity.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies the AI of an entity.
    private Integer id;

    private String name;
    private String contact;
    private String email;
    private String address;
    private String note;

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Customer(Integer id, String name, String contact, String email, String address, String note) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.email = email;
        this.address = address;
        this.note = note;
    }
}
