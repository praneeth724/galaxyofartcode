package lk.galaxyofart.production;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductionRepository extends JpaRepository<Production, Integer> {

    @Query(value = "SELECT new Production(p.id, p.customername, p.contact, p.jobid, p.jobstatus, p.ordereddate, p.deliverydate, p.product_id, p.designcategory, p.designformat, p.designfile, p.printarea, p.colormode, p.designsize, p.quantity, p.unitcost, p.inkcost, p.papercost, p.designcost, p.discount, p.discountamount, p.total, p.advance, p.balance, p.approvedbymanager) FROM Production p")
    List<Production> getSelectedColumn();
}
