package lk.galaxyofart.purchaseorder;

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
import lk.galaxyofart.artistsupplierdetails.Asdetails;
import lk.galaxyofart.productdetails.Products;
import lk.galaxyofart.quotation.Quotation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchaseorder")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "quotation_id", referencedColumnName = "id")
    private Quotation quotation_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Asdetails supplier_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private String orderid; // auto "PO-0001"
    private LocalDate orderdate;
    private LocalDate requireddate;
    private Integer quantity;
    private Double total;
    private String status; // Pending | Approved | Received | Cancelled

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public PurchaseOrder(Integer id, Quotation quotation_id, Asdetails supplier_id, Products product_id,
            String orderid, LocalDate orderdate, LocalDate requireddate, Integer quantity, Double total,
            String status) {
        this.id = id;
        this.quotation_id = quotation_id;
        this.supplier_id = supplier_id;
        this.product_id = product_id;
        this.orderid = orderid;
        this.orderdate = orderdate;
        this.requireddate = requireddate;
        this.quantity = quantity;
        this.total = total;
        this.status = status;
    }
}
