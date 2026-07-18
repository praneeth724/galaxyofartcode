package lk.galaxyofart.privilage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

// Repository interface for managing objects.
// Parameters -> <Entity class name , Primary key Data type>
public interface RolesRepository extends JpaRepository<Roles, Integer> {

    // Query to retrieve all RolesEntity records excluding the one named 'Admin'.
    @Query(value = "select r from Roles r where r.name<>'Admin'") // not equel --> <>
    List<Roles> getAllDataWithoutAdmin();

    @Query(value = "SELECT r.* FROM roles_table r WHERE r.id IN " +
            "(SELECT uhr.role_table_id FROM user_table_has_role_table uhr WHERE uhr.user_table_id = ?1)", nativeQuery = true)
    List<Roles> getRolesByUserId(Integer userId);

    @Query(value = "select r from Roles r where r.name=?1")
    Roles getByName(String name);

}
