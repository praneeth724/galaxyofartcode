package lk.galaxyofart.privilage;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; 

//Specifies that the class is an entity
@Entity
@Table(name = "privilage_table") // specifies the primary table

@Data // setter, getter
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // empty constructor
public class Privilage  {

    public static final String getModule_table_id = null;
    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime; 

    @Id // Identifies the primary key of an entity.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies the AI of an entity.
    private Integer id;

    @ManyToOne // Specify Relationship
    @JoinColumn(name = "roles_table_id", referencedColumnName = "id") // Foreign key column
    @NotNull // No null values
    private Roles roles_table_id; // role = entity

    @ManyToOne // Specify Relationship
    @JoinColumn(name = "module_table_id", referencedColumnName = "id") // Foreign key column
    @NotNull
    private Modules module_table_id; // modules = entity

    private Boolean privi_select;

    private Boolean privi_insert;

    private Boolean privi_update;

    private Boolean privi_delete;

   
   

}
