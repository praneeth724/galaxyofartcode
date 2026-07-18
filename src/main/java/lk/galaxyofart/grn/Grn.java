package lk.galaxyofart.grn;

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
import lk.galaxyofart.purchaseorder.PurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grn")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Grn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id")
    private PurchaseOrder purchaseorder_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Asdetails supplier_id;

    private String grnno; // auto "GRN-0001"
    private LocalDate orderdate;
    private LocalDate receiveddate;
    private Integer receivedquantity;
    private Integer damagedquantity;
    private Double totalamount;
    private String paymethod;
    private String status; // Pending | Received | Paid

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Grn(Integer id, PurchaseOrder purchaseorder_id, Asdetails supplier_id, String grnno, LocalDate orderdate,
            LocalDate receiveddate, Integer receivedquantity, Integer damagedquantity, Double totalamount,
            String paymethod, String status) {
        this.id = id;
        this.purchaseorder_id = purchaseorder_id;
        this.supplier_id = supplier_id;
        this.grnno = grnno;
        this.orderdate = orderdate;
        this.receiveddate = receiveddate;
        this.receivedquantity = receivedquantity;
        this.damagedquantity = damagedquantity;
        this.totalamount = totalamount;
        this.paymethod = paymethod;
        this.status = status;
    }
}
