package lk.galaxyofart.productdetails;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductsRepository extends JpaRepository<Products, Integer> {

    // mug_id/statue_id are mutually exclusive depending on producttype, so both
    // associations must be LEFT joins - an inner join on both would exclude every row
    @Query(value = "SELECT new Products(p.id, p.producttype, p.name, p.itemcode, p.medium, p.image, p.artdescription, p.price, mug, statue) FROM Products p LEFT JOIN p.mug_id mug LEFT JOIN p.statue_id statue")
    List<Products> getSelectedColumn();

    @Query(value = "SELECT new Products(p.id, p.producttype, p.name, p.itemcode, p.medium, p.image, p.artdescription, p.price, mug, statue) FROM Products p LEFT JOIN p.mug_id mug LEFT JOIN p.statue_id statue WHERE p.producttype = ?1")
    List<Products> getSelectedColumnByType(String producttype);

    @Query(value = "select p from Products p where p.itemcode=?1")
    Products getByItemcode(String itemcode);
}
