package lk.galaxyofart.artistsupplierdetails;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
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
@Table(name = "artistsupplierdetails") // specifies the primary table

@Data // setter, getter
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // empty constructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Asdetails {

    @Id // Identifies the primary key of an entity.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies the AI of an entity.
    private Integer id;

    @Column(name = "type")
    private String type; // artist or supplier

    private String name;
    private String nic;
    private String email;
    private String contact;
    private String beneficiary;
    private String bank;
    private String account;
    private String brn;
    private String address;
    private String producttype;

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;
}
