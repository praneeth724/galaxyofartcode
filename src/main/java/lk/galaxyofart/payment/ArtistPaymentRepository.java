package lk.galaxyofart.payment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ArtistPaymentRepository extends JpaRepository<ArtistPayment, Integer> {

    @Query(value = "SELECT new ArtistPayment(p.id, p.artist_id, p.product_id, p.commissiontype, p.commissionrate, p.price, p.quantity, p.total, p.paybleamount, p.paymethod, p.paydate, p.paystatus, p.payno, p.balance, p.payduedate) FROM ArtistPayment p")
    List<ArtistPayment> getSelectedColumn();
}
