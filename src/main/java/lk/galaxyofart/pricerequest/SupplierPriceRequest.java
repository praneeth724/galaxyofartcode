package lk.galaxyofart.pricerequest;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pricerequest")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SupplierPriceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Asdetails supplier_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private Double price;
    private Integer quantity;
    private String requestid; // auto "PR-0001"
    private LocalDate requestdate;
    private String status; // Pending | Responded | Rejected

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public SupplierPriceRequest(Integer id, Asdetails supplier_id, Products product_id, Double price,
            Integer quantity, String requestid, LocalDate requestdate, String status) {
        this.id = id;
        this.supplier_id = supplier_id;
        this.product_id = product_id;
        this.price = price;
        this.quantity = quantity;
        this.requestid = requestid;
        this.requestdate = requestdate;
        this.status = status;
    }
}
