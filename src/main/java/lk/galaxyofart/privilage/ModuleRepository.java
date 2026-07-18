package lk.galaxyofart.privilage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

// Repository interface for managing objects.
// Parameters -> <Entity class name , Primary key Data type>
public interface ModuleRepository extends JpaRepository<Modules, Integer> {

      @Query(value = " SELECT * FROM galaxyofart.module_table as m where m.id not in  \n" +
                  "(SELECT p.module_table_id FROM galaxyofart.privilage_table as p where p.privi_select=true and p.roles_table_id in \n"
                  +
                  "(SELECT uhr.role_table_id FROM galaxyofart.user_table_has_role_table as uhr where uhr.user_table_id in \n"
                  +
                  "(SELECT u.id FROM galaxyofart.user_table as u where u.username=?1)))", nativeQuery = true)
      List<Modules> getModulesByUser(String username);

}
