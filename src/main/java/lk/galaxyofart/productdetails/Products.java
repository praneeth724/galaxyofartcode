package lk.galaxyofart.productdetails;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product")

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String producttype; // "art" | "statue" | "mug"

    private String name;
    private String itemcode;
    private String medium;
    private String image;
    private String artdescription;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "mug_id", referencedColumnName = "id")
    private Mugs mug_id; // set only when producttype = mug

    @ManyToOne
    @JoinColumn(name = "statue_id", referencedColumnName = "id")
    private Statues statue_id; // set only when producttype = statue

    private LocalDateTime addeddatetime;
    private LocalDateTime updatedatetime;
    private LocalDateTime deletedatetime;

    public Products(Integer id, String producttype, String name, String itemcode, String medium, String image,
            String artdescription, Double price, Mugs mug_id, Statues statue_id) {
        this.id = id;
        this.producttype = producttype;
        this.name = name;
        this.itemcode = itemcode;
        this.medium = medium;
        this.image = image;
        this.artdescription = artdescription;
        this.price = price;
        this.mug_id = mug_id;
        this.statue_id = statue_id;
    }
}
