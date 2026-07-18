package lk.galaxyofart.pricerequest;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierPriceRequestRepository extends JpaRepository<SupplierPriceRequest, Integer> {

    @Query(value = "SELECT new SupplierPriceRequest(p.id, p.supplier_id, p.product_id, p.price, p.quantity, p.requestid, p.requestdate, p.status) FROM SupplierPriceRequest p")
    List<SupplierPriceRequest> getSelectedColumn();

    @Query(value = "select p from SupplierPriceRequest p where p.requestid=?1")
    SupplierPriceRequest getByRequestid(String requestid);
}
