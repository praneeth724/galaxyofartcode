package lk.galaxyofart.employee;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //Specifies that the class is an entity
@Table(name = "employee_status") // specifies the primary table

@Data  //setter, getter
@AllArgsConstructor  //all argument constructor
@NoArgsConstructor  //empty constructor

public class Employeestatus {
    @Id // Identifies the primary key of an entity.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies the AI of an entity.
    private Integer id;

    private String name;
}
