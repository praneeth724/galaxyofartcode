package lk.galaxyofart.artistsupplierdetails;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AsdetailsRepository extends JpaRepository<Asdetails, Integer> {

    @Override
    Asdetails getReferenceById(Integer id);

    //@Query(value = "SELECT new Asdetails(a.id, a.name, a.nic, a.email, a.contact, a.beneficiary, a.bank, a.account) FROM Asdetails as a")
    @Query(value = "SELECT a FROM Asdetails a")
    List<Asdetails> getSelectedColumn();

    @Query("from Asdetails a where a.type=?1")
    List<Asdetails> findByType(String type);

    @Override
    void delete(Asdetails asdetails);

    @Query(value = "SELECT a FROM Asdetails a WHERE a.nic = ?1")
    Asdetails getByNic(String nic);

    @Query(value = "SELECT a FROM Asdetails a WHERE a.email = ?1")
    Asdetails getByEmail(String email);

    @Override
    <S extends Asdetails> S save(S asdetails);

    @Query(value = "SELECT a FROM Asdetails a WHERE a.contact = ?1")
    Asdetails getByContact(String contact);

    @Query(value = "SELECT a FROM Asdetails a WHERE a.brn = ?1")
    Asdetails getByBrn(String brn);

}
