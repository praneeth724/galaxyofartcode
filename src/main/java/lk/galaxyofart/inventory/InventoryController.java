package lk.galaxyofart.inventory;

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
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("inventory")
    public ModelAndView inventoryPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView inventoryUI = new ModelAndView();
        inventoryUI.addObject("loggedusername", authentication.getName());
        inventoryUI.setViewName("5.inventory.html");
        return inventoryUI;
    }

    @GetMapping(value = "/inventory/byid", params = { "id" }, produces = "application/json")
    public Inventory getInventoryByIdQP(@RequestParam("id") Integer id) {
        return inventoryDao.getReferenceById(id);
    }

    @GetMapping(value = "/inventory/alldata", produces = "application/json")
    public List<Inventory> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "inventory");

        if (userPriv.getPrivi_select()) {
            return inventoryDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/inventory/delete")
    public String deleteInventory(@RequestBody Inventory inventory) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "inventory");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        Inventory extInventory = inventoryDao.getReferenceById(inventory.getId());
        if (extInventory == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            inventoryDao.delete(inventory);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/inventory/save")
    public String saveInventory(@RequestBody Inventory inventory) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "inventory");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        Inventory extByProduct = inventoryDao.getByProductId(inventory.getProduct_id().getId());
        if (extByProduct != null) {
            return "Save Not Completed..! : Inventory Record For This Product Already Exists ..!";
        }

        try {
            inventory.setAddeddatetime(LocalDateTime.now());
            inventoryDao.save(inventory);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/inventory/update")
    public String updateInventory(@RequestBody Inventory inventory) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "inventory");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        Inventory extInventory = inventoryDao.getReferenceById(inventory.getId());
        if (extInventory == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        Inventory extByProduct = inventoryDao.getByProductId(inventory.getProduct_id().getId());
        if (extByProduct != null && !extByProduct.getId().equals(inventory.getId())) {
            return "Update Not Completed..! : Inventory Record For This Product Already Exists ..!";
        }

        try {
            inventory.setUpdatedatetime(LocalDateTime.now());
            inventoryDao.save(inventory);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
