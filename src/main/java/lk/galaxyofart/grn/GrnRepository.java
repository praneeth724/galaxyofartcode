package lk.galaxyofart.grn;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GrnRepository extends JpaRepository<Grn, Integer> {

    @Query(value = "SELECT new Grn(g.id, g.purchaseorder_id, g.supplier_id, g.grnno, g.orderdate, g.receiveddate, g.receivedquantity, g.damagedquantity, g.totalamount, g.paymethod, g.status) FROM Grn g")
    List<Grn> getSelectedColumn();

    @Query(value = "select g from Grn g where g.receiveddate between ?1 and ?2")
    List<Grn> getByDateRange(LocalDate from, LocalDate to);
}
