package lk.galaxyofart.inventory;

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
@Table(name = "inventory")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Products product_id;

    private Integer total;
    private Integer damaged;
    private Integer available;
    private Integer rop;
    private Integer roq;

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Inventory(Integer id, Products product_id, Integer total, Integer damaged, Integer available,
            Integer rop, Integer roq) {
        this.id = id;
        this.product_id = product_id;
        this.total = total;
        this.damaged = damaged;
        this.available = available;
        this.rop = rop;
        this.roq = roq;
    }
}
