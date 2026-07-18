package lk.galaxyofart.privilage;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // To identify this class as Database table
@Table(name = "module_table") //Specify Database table name

@Data // to create getters and setters
@AllArgsConstructor // create all argument constructor
@NoArgsConstructor // create default constructor
public class Modules {

    @Id // to specify this as PRIMARY KEY (PK) coloum
    @GeneratedValue(strategy = GenerationType.IDENTITY) // to specify this PK coloum as AUTO INCREMENT (AI)
    private Integer id;

   
    private String name;
}

