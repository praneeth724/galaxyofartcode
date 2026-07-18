package lk.galaxyofart.employee;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query(value = "SELECT coalesce(lpad(max(e.number)+1,5,'0') , '00000001') FROM galaxyofart.employee_table as e;", nativeQuery = true) // native
    String getNextNumber();

    // for check duplicate of mail,nic,mobile

    @Query(value = "select e from Employee e where e.nic=?1") // JPQL query
    Employee getByNic(String nic);

    @Query(value = "select e from Employee e where e.mobilenumber=?1")
    Employee getByMobilenumber(String mobilenumber);

    @Query(value = "select e from Employee e where e.email=?1")
    Employee getByEmail(String email);

    @Query(value = "SELECT new Employee(e.id, e.fullname, e.nic, e.email, e.mobilenumber, e.designation_table_id, e.employee_status_id, e.dob) FROM Employee as e")
    List<Employee> getSelectedColumn();

}
