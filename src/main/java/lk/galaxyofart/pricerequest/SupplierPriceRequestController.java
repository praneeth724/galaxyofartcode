package lk.galaxyofart.pricerequest;

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
public class SupplierPriceRequestController {

    @Autowired
    private SupplierPriceRequestRepository priceRequestDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("supplierpricerequest")
    public ModelAndView pricerequestPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("3.supplierpricerequest.html");
        return ui;
    }

    @GetMapping(value = "/supplierpricerequest/byid", params = { "id" }, produces = "application/json")
    public SupplierPriceRequest getByIdQP(@RequestParam("id") Integer id) {
        return priceRequestDao.getReferenceById(id);
    }

    @GetMapping(value = "/supplierpricerequest/alldata", produces = "application/json")
    public List<SupplierPriceRequest> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "supplierpricerequest");

        if (userPriv.getPrivi_select()) {
            return priceRequestDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/supplierpricerequest/delete")
    public String deletePriceRequest(@RequestBody SupplierPriceRequest priceRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "supplierpricerequest");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        SupplierPriceRequest ext = priceRequestDao.getReferenceById(priceRequest.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            priceRequestDao.delete(priceRequest);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/supplierpricerequest/save")
    public String savePriceRequest(@RequestBody SupplierPriceRequest priceRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "supplierpricerequest");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            priceRequest.setAddeddatetime(LocalDateTime.now());
            priceRequest = priceRequestDao.save(priceRequest);

            priceRequest.setRequestid("PR-" + String.format("%04d", priceRequest.getId()));
            priceRequestDao.save(priceRequest);

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/supplierpricerequest/update")
    public String updatePriceRequest(@RequestBody SupplierPriceRequest priceRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "supplierpricerequest");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        SupplierPriceRequest ext = priceRequestDao.getReferenceById(priceRequest.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            priceRequest.setUpdatedatetime(LocalDateTime.now());
            priceRequestDao.save(priceRequest);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
