package lk.galaxyofart.grn;

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
import lk.galaxyofart.purchaseorder.PurchaseOrder;
import lk.galaxyofart.purchaseorder.PurchaseOrderRepository;

@RestController
public class GrnController {

    @Autowired
    private GrnRepository grnDao;

    @Autowired
    private InventoryRepository inventoryDao;

    @Autowired
    private PurchaseOrderRepository purchaseOrderDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("grn")
    public ModelAndView grnPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("7.grn.html");
        return ui;
    }

    @GetMapping(value = "/grn/byid", params = { "id" }, produces = "application/json")
    public Grn getByIdQP(@RequestParam("id") Integer id) {
        return grnDao.getReferenceById(id);
    }

    @GetMapping(value = "/grn/alldata", produces = "application/json")
    public List<Grn> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "grn");

        if (userPriv.getPrivi_select()) {
            return grnDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/grn/delete")
    public String deleteGrn(@RequestBody Grn grn) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "grn");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        Grn ext = grnDao.getReferenceById(grn.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            grnDao.delete(grn);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/grn/save")
    public String saveGrn(@RequestBody Grn grn) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "grn");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            grn.setAddeddatetime(LocalDateTime.now());
            grn = grnDao.save(grn);

            grn.setGrnno("GRN-" + String.format("%04d", grn.getId()));
            grnDao.save(grn);

            // increment inventory for the received product - re-fetch the purchase
            // order authoritatively rather than trusting the client's nested JSON,
            // which may only carry the referenced id (e.g. {"purchaseorder_id":{"id":1}})
            if (grn.getPurchaseorder_id() != null && grn.getPurchaseorder_id().getId() != null) {
                PurchaseOrder purchaseOrder = purchaseOrderDao.getReferenceById(grn.getPurchaseorder_id().getId());

                if (purchaseOrder != null && purchaseOrder.getProduct_id() != null) {
                    Integer productId = purchaseOrder.getProduct_id().getId();
                    Inventory inventory = inventoryDao.getByProductId(productId);

                    if (inventory == null) {
                        inventory = new Inventory();
                        inventory.setProduct_id(purchaseOrder.getProduct_id());
                        inventory.setTotal(0);
                        inventory.setDamaged(0);
                        inventory.setAvailable(0);
                        inventory.setRop(0);
                        inventory.setRoq(0);
                        inventory.setAddeddatetime(LocalDateTime.now());
                    }

                    int received = grn.getReceivedquantity() != null ? grn.getReceivedquantity() : 0;
                    int damaged = grn.getDamagedquantity() != null ? grn.getDamagedquantity() : 0;

                    inventory.setTotal(inventory.getTotal() + received);
                    inventory.setDamaged(inventory.getDamaged() + damaged);
                    inventory.setAvailable(inventory.getAvailable() + (received - damaged));
                    inventory.setUpdatedatetime(LocalDateTime.now());

                    inventoryDao.save(inventory);
                }
            }

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/grn/update")
    public String updateGrn(@RequestBody Grn grn) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "grn");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        Grn ext = grnDao.getReferenceById(grn.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            grn.setUpdatedatetime(LocalDateTime.now());
            grnDao.save(grn);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
