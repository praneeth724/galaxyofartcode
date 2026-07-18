package lk.galaxyofart.quotation;

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
import lk.galaxyofart.pricerequest.SupplierPriceRequest;
import lk.galaxyofart.productdetails.Products;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//Specifies that the class is an entity
@Entity
@Table(name = "quotation") // specifies the primary table

@Data // setter, getter
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // empty constructor
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Quotation {

    @Id // Identifies the primary key of an entity.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies the AI of an entity.
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pricerequest_id", referencedColumnName = "id")
    private SupplierPriceRequest pricerequest_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Asdetails supplier_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private String quotationid; // auto "QT-0001"
    private LocalDate requestdate;
    private LocalDate deadline;
    private Double price;
    private Double discount;
    private Integer quantity;
    private String status; // Pending | Approved | Rejected

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Quotation(Integer id, SupplierPriceRequest pricerequest_id, Asdetails supplier_id, Products product_id,
            String quotationid, LocalDate requestdate, LocalDate deadline, Double price, Double discount,
            Integer quantity, String status) {
        this.id = id;
        this.pricerequest_id = pricerequest_id;
        this.supplier_id = supplier_id;
        this.product_id = product_id;
        this.quotationid = quotationid;
        this.requestdate = requestdate;
        this.deadline = deadline;
        this.price = price;
        this.discount = discount;
        this.quantity = quantity;
        this.status = status;
    }
}
