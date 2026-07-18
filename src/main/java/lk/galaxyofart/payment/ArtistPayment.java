package lk.galaxyofart.payment;

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
@Table(name = "payment")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ArtistPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "artist_id", referencedColumnName = "id")
    private Asdetails artist_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private String commissiontype; // Percentage | Fixed Amount
    private Double commissionrate;
    private Double price;
    private Integer quantity;
    private Double total;
    private Double paybleamount;
    private String paymethod;
    private LocalDate paydate;
    private String paystatus;
    private String payno; // auto "PAY-0001"
    private Double balance;
    private LocalDate payduedate;

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public ArtistPayment(Integer id, Asdetails artist_id, Products product_id, String commissiontype,
            Double commissionrate, Double price, Integer quantity, Double total, Double paybleamount,
            String paymethod, LocalDate paydate, String paystatus, String payno, Double balance,
            LocalDate payduedate) {
        this.id = id;
        this.artist_id = artist_id;
        this.product_id = product_id;
        this.commissiontype = commissiontype;
        this.commissionrate = commissionrate;
        this.price = price;
        this.quantity = quantity;
        this.total = total;
        this.paybleamount = paybleamount;
        this.paymethod = paymethod;
        this.paydate = paydate;
        this.paystatus = paystatus;
        this.payno = payno;
        this.balance = balance;
        this.payduedate = payduedate;
    }
}
