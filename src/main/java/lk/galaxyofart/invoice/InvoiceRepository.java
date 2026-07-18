package lk.galaxyofart.invoice;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query(value = "SELECT new Invoice(i.id, i.customer_id, i.product_id, i.invoiceno, i.invoicedate, i.quantity, i.price, i.discount, i.total, i.paymethod, i.payamount, i.balance, i.status) FROM Invoice i")
    List<Invoice> getSelectedColumn();

    @Query(value = "select i from Invoice i where i.invoicedate between ?1 and ?2")
    List<Invoice> getByDateRange(LocalDate from, LocalDate to);
}
