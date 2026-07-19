package lk.galaxyofart.production;

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
import lk.galaxyofart.productdetails.Products;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "production")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String customername;
    private String contact;
    private String jobid; // auto "JOB-0001"
    private String jobstatus; // Pending | Printing | Completed
    private LocalDate ordereddate;
    private LocalDate deliverydate;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private String designcategory;
    private String designformat;
    private String designfile;
    private String printarea;
    private String colormode;
    private String designsize;
    private Integer quantity;
    private Double unitcost;
    private Double inkcost;
    private Double papercost;
    private Double designcost;
    private Double discount;
    private Double discountamount;
    private Double total;
    private Double advance;
    private Double balance;
    private Boolean approvedbymanager;

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Production(Integer id, String customername, String contact, String jobid, String jobstatus,
            LocalDate ordereddate, LocalDate deliverydate, Products product_id, String designcategory,
            String designformat, String designfile, String printarea, String colormode, String designsize,
            Integer quantity, Double unitcost, Double inkcost, Double papercost, Double designcost, Double discount,
            Double discountamount, Double total, Double advance, Double balance, Boolean approvedbymanager) {
        this.id = id;
        this.customername = customername;
        this.contact = contact;
        this.jobid = jobid;
        this.jobstatus = jobstatus;
        this.ordereddate = ordereddate;
        this.deliverydate = deliverydate;
        this.product_id = product_id;
        this.designcategory = designcategory;
        this.designformat = designformat;
        this.designfile = designfile;
        this.printarea = printarea;
        this.colormode = colormode;
        this.designsize = designsize;
        this.quantity = quantity;
        this.unitcost = unitcost;
        this.inkcost = inkcost;
        this.papercost = papercost;
        this.designcost = designcost;
        this.discount = discount;
        this.discountamount = discountamount;
        this.total = total;
        this.advance = advance;
        this.balance = balance;
        this.approvedbymanager = approvedbymanager;
    }
}
