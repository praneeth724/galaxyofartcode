package lk.galaxyofart.quotation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {

    @Query(value = "SELECT new Quotation(q.id, q.pricerequest_id, q.supplier_id, q.product_id, q.quotationid, q.requestdate, q.deadline, q.price, q.discount, q.quantity, q.status) FROM Quotation q")
    List<Quotation> getSelectedColumn();

    @Override
    Quotation getReferenceById(Integer id);

}
