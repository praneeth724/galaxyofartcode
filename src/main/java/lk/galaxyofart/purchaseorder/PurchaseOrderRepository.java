package lk.galaxyofart.purchaseorder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query(value = "SELECT new PurchaseOrder(p.id, p.quotation_id, p.supplier_id, p.product_id, p.orderid, p.orderdate, p.requireddate, p.quantity, p.total, p.status) FROM PurchaseOrder p")
    List<PurchaseOrder> getSelectedColumn();
}
