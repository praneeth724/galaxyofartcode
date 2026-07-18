package lk.galaxyofart.invoice;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.galaxyofart.customerdetails.Customer;
import lk.galaxyofart.productdetails.Products;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoice")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private String invoiceno; // auto "INV-0001"
    private LocalDate invoicedate;
    private Integer quantity;
    private Double price;
    private Double discount;
    private Double total;
    private String paymethod;
    private Double payamount;
    private Double balance;
    private String status; // Paid | Pending

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Invoice(Integer id, Customer customer_id, Products product_id, String invoiceno, LocalDate invoicedate,
            Integer quantity, Double price, Double discount, Double total, String paymethod, Double payamount,
            Double balance, String status) {
        this.id = id;
        this.customer_id = customer_id;
        this.product_id = product_id;
        this.invoiceno = invoiceno;
        this.invoicedate = invoicedate;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        this.total = total;
        this.paymethod = paymethod;
        this.payamount = payamount;
        this.balance = balance;
        this.status = status;
    }
}
