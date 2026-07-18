package lk.galaxyofart.customerdetails;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query(value = "SELECT new Customer(c.id,c.name,c.contact,c.email,c.address,c.note) FROM Customer c")
    List<Customer> getSelectedColumn();

    @Override
    Customer getReferenceById(Integer id);

    // Search by Contact
    @Query(value = "select c from Customer c where c.contact=?1")
    Customer getByContact(String contact);

    // Search by Email
    @Query(value = "select c from Customer c where c.email=?1")
    Customer getByEmail(String email);

    // Search by Name
    @Query(value = "select c from Customer c where c.name=?1")
    Customer getByName(String name);
}
