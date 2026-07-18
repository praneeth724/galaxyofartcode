package lk.galaxyofart.privilage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilageRepository extends JpaRepository<Privilage, Integer> { // integer=(privilage= entity eka) mhe
                                                                                 // tble pk eke type eka

    // JPQL query to retrieve a specific PrivillageEntity based on its associated
    // role ID and module ID.
    @Query(value = "select p from Privilage p where p.roles_table_id.id = ?1 and p.module_table_id.id = ?2")
    Privilage getByRoleModule(Integer roleid, Integer moduleid);

    // get privilage by logged username and module name
    @Query(value = "SELECT bit_or(p.privi_select) as pri_select, bit_or(p.privi_insert) as pri_insert, bit_or(p.privi_update) as pri_update, bit_or(p.privi_delete) as pri_delete \n"
            +
            "FROM galaxyofart.privilage_table as p where p.module_table_id in \n" +
            "(select m.id from galaxyofart.module_table as m where m.name=?2) and p.roles_table_id in \n" +
            "(select uhr.role_table_id from galaxyofart.user_table_has_role_table as uhr where uhr.user_table_id in \n" +
            "(select u.id from galaxyofart.user_table as u where u.username=?1));", nativeQuery = true)

    PrivilegeAggregate getPrivilageByUserAndModule(String username, String modulename);

    // Typed projection for the aggregate native query above (bit_or() results are
    // read as Long, since the old single-String return type couldn't be split
    // correctly and always broke for non-admin users)
    interface PrivilegeAggregate {
        Long getPri_select();
        Long getPri_insert();
        Long getPri_update();
        Long getPri_delete();
    }
}
