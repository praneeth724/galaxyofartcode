package lk.galaxyofart.purchaseorder;

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
import lk.galaxyofart.privilage.Privilage;

@RestController
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository purchaseOrderDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("purchaseorder")
    public ModelAndView purchaseOrderPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("6.purchaseorder.html");
        return ui;
    }

    @GetMapping(value = "/purchaseorder/byid", params = { "id" }, produces = "application/json")
    public PurchaseOrder getByIdQP(@RequestParam("id") Integer id) {
        return purchaseOrderDao.getReferenceById(id);
    }

    @GetMapping(value = "/purchaseorder/alldata", produces = "application/json")
    public List<PurchaseOrder> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "purchaseorder");

        if (userPriv.getPrivi_select()) {
            return purchaseOrderDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/purchaseorder/delete")
    public String deletePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "purchaseorder");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        PurchaseOrder ext = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            purchaseOrderDao.delete(purchaseOrder);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/purchaseorder/save")
    public String savePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "purchaseorder");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            purchaseOrder.setAddeddatetime(LocalDateTime.now());
            purchaseOrder = purchaseOrderDao.save(purchaseOrder);

            purchaseOrder.setOrderid("PO-" + String.format("%04d", purchaseOrder.getId()));
            purchaseOrderDao.save(purchaseOrder);

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/purchaseorder/update")
    public String updatePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "purchaseorder");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        PurchaseOrder ext = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            purchaseOrder.setUpdatedatetime(LocalDateTime.now());
            purchaseOrderDao.save(purchaseOrder);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
