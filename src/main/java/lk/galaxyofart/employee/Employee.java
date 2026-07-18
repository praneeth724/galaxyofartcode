package lk.galaxyofart.employee;


import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


//Specifies that the class is an entity
@Entity
@Table(name = "employee_table")  //specifies the primary table

@Data  //setter, getter
@AllArgsConstructor  //all argument constructor
@NoArgsConstructor  //empty constructor
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Employee {

    @Id   //Identifies the primary key of an entity.
    @GeneratedValue(strategy = GenerationType.IDENTITY)   //Specifies the AI of an entity.
    private Integer id;

    private String number;
    private String fullname;
    private String callingname;
    private String namewithinitial;
    private String nic;
    private String mobilenumber;
    private String email;
    private String address;
    private LocalDate dob;
    private String gender;
    private String civilstatus;
    private String note;
    private String landnumber;

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    @ManyToOne        //employee & designation table has many to one relationship. designation_table_id column is a join column
    @JoinColumn(name = "designation_table_id" , referencedColumnName = "id")
    private Designation designation_table_id;

    @ManyToOne        //employee & employee status table has many to one relationship. employee_status_id column is a join column
    @JoinColumn(name = "employee_status_id" , referencedColumnName = "id")
    private Employeestatus employee_status_id;

    public Employee(Integer id, String fullname, String nic, String email, String mobilenumber, Designation designation_table_id, Employeestatus employee_status_id, LocalDate dob) {
        this.id = id;
        this.fullname = fullname;
        this.nic = nic;
        this.email = email;
        this.mobilenumber = mobilenumber;
        this.designation_table_id = designation_table_id;
        this.employee_status_id = employee_status_id;
        this.dob = dob;
    }
}
