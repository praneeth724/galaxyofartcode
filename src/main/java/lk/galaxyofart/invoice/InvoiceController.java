package lk.galaxyofart.invoice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.inventory.Inventory;
import lk.galaxyofart.inventory.InventoryRepository;
import lk.galaxyofart.privilage.Privilage;

@RestController
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private InventoryRepository inventoryDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("invoice")
    public ModelAndView invoicePage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("9.invoice.html");
        return ui;
    }

    @GetMapping(value = "/invoice/byid", params = { "id" }, produces = "application/json")
    public Invoice getByIdQP(@RequestParam("id") Integer id) {
        return invoiceDao.getReferenceById(id);
    }

    @GetMapping(value = "/invoice/alldata", produces = "application/json")
    public List<Invoice> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "invoice");

        if (userPriv.getPrivi_select()) {
            return invoiceDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/invoice/delete")
    public String deleteInvoice(@RequestBody Invoice invoice) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "invoice");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        Invoice ext = invoiceDao.getReferenceById(invoice.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            invoiceDao.delete(invoice);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/invoice/save")
    public String saveInvoice(@RequestBody Invoice invoice) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "invoice");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            invoice.setBalance(invoice.getTotal() - invoice.getPayamount());
            invoice.setStatus(invoice.getBalance() <= 0 ? "Paid" : "Pending");
            invoice.setAddeddatetime(LocalDateTime.now());
            invoice = invoiceDao.save(invoice);

            invoice.setInvoiceno("INV-" + String.format("%04d", invoice.getId()));
            invoiceDao.save(invoice);

            // decrement inventory for the sold product
            if (invoice.getProduct_id() != null) {
                Inventory inventory = inventoryDao.getByProductId(invoice.getProduct_id().getId());
                if (inventory != null) {
                    int sold = invoice.getQuantity() != null ? invoice.getQuantity() : 0;
                    inventory.setAvailable(inventory.getAvailable() - sold);
                    inventory.setUpdatedatetime(LocalDateTime.now());
                    inventoryDao.save(inventory);
                }
            }

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/invoice/update")
    public String updateInvoice(@RequestBody Invoice invoice) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "invoice");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        Invoice ext = invoiceDao.getReferenceById(invoice.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            invoice.setBalance(invoice.getTotal() - invoice.getPayamount());
            invoice.setStatus(invoice.getBalance() <= 0 ? "Paid" : "Pending");
            invoice.setUpdatedatetime(LocalDateTime.now());
            invoiceDao.save(invoice);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
