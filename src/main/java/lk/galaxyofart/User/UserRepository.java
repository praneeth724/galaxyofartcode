package lk.galaxyofart.User;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query(value = "select u from User u where u.useremail=?1")
    User getByUseremail(String useremail);

    @Query(value = "select u from User u where u.employee_table_id.id=?1")
    User getByEmployee_id(Integer emp_id);

    @Query(value = "select new User(u.id, u.username, u.useremail, u.employee_table_id, u.status) from User u where u.username <> 'Admin'  ")
    List<User> getSelectedColumn();

    @Query(value = "select u from User u where u.username=?1")
     User getByUsername(String username);

   
}
