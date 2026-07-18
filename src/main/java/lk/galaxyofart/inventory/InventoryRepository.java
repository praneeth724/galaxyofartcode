package lk.galaxyofart.inventory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    @Query(value = "SELECT new Inventory(i.id, i.product_id, i.total, i.damaged, i.available, i.rop, i.roq) FROM Inventory i")
    List<Inventory> getSelectedColumn();

    @Query(value = "select i from Inventory i where i.product_id.id=?1")
    Inventory getByProductId(Integer productId);
}
