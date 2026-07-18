package lk.galaxyofart.customerdetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.privilage.Privilage;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class CustomerController {

    @Autowired // create an object of customerDao
    private CustomerRepository customerDao;

    @Autowired
    private AuthController authController;

    // create mapping for return ui URL [/customerdetails]
    @RequestMapping("customerdetails")
    public ModelAndView customerdetailsPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // must include in all
                                                                                                // controllers
        ModelAndView cutomerdetailsUI = new ModelAndView();
        cutomerdetailsUI.addObject("loggedusername", authentication.getName()); // must include in all controllers
        cutomerdetailsUI.setViewName("12.customerdetails.html");

        return cutomerdetailsUI;
    }

    // Create get mapping for get custm object by given id (reqst param)
    // [url/customerdetails/byid?id= ]
    @GetMapping(value = "/customerdetails/byid", params = { "id" }, produces = "application/json")
    public Customer getCustomerByIdQP(@RequestParam("id") Integer id) {
        return customerDao.getReferenceById(id);
    }

    // create mapping for get all customer data URL [/customerdetails/alldata]
    @RequestMapping(value = "/customerdetails/alldata", method = RequestMethod.GET, produces = "application/json")
    public List<Customer> getAllCustomersData() {
        // return customerDao.findAll();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "customerdetails");
        if (userPriv.getPrivi_select()) {
            return customerDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    // create delete mapping for delete givencustomer
    @DeleteMapping(value = "/customerdetails/delete")
    public String deleteCustomer(@RequestBody Customer customer) {

        // 1. need to check log user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "customerdetails");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        // 2. need to chek data existances or data duplicate
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
        if (extCustomer == null) {
            return "Delete Not Completed..! :" + customer.getName() + "is Not Available..!";
        }

        // 3. use try catch
        try {

            // 1.do operation
            customerDao.delete(customer);

            // 2.dependanceses check

            return "OK";

        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }

    }

    // create post mapping for save given customer object
    @PostMapping(value = "/customerdetails/save")
    public String saveCustomer(@RequestBody Customer customer) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "customerdetails");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance or data duplicate

        // mail duplicate cheking
        Customer extCustomerByEmail = customerDao.getByEmail(customer.getEmail());
        if (extCustomerByEmail != null) {
            return "Save Not Completed..! : Given Email Allready Exists ..!";
        }

        // contct duply check
        Customer extCustomerByContact = customerDao.getByContact(customer.getContact());
        if (extCustomerByContact != null) {
            return "Save Not Completed..! : Given Contact Number Allready Exists ..!";
        }

        // 3.try catch
        try {

            // add auto set values
            customer.setAddeddatetime(LocalDateTime.now());

            // do operation
            customerDao.save(customer);

            // dependanceses check

            return "OK";

        } catch (Exception e) {
            // handle exception
            return "Save Not Completed..!" + customer.getName();
        }

    }

    // create mapping for update customer record
    @PutMapping(value = "/customerdetails/update")
    public String updateCustomer(@RequestBody Customer customer) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "customerdetails");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
        if (extCustomer == null) {
            return "Update Not Completed..! :" + customer.getName() + " is Not Available ..!";
        }

        // 3.check duplicate
        Customer extCustomerByEmail = customerDao.getByEmail(customer.getEmail());
        if (extCustomerByEmail != null && !extCustomerByEmail.getId().equals(extCustomer.getId())) {
            return "Save Not Completed..! : Given Email Already Exists ..!";
        }

        Customer extCustomerByContact = customerDao.getByContact(customer.getContact());
        if (extCustomerByContact != null && !extCustomerByContact.getId().equals(extCustomer.getId())) {
            return "Save Not Completed..! : Given Contact Number Already Exists ..!";
        }

        // 4.try catch
        try {
            // add auto set values
            customer.setUpdatedatetime(LocalDateTime.now());

            // do operation
            customerDao.save(customer);

            // dependanceses check
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + customer.getName();
        }

    }
}
