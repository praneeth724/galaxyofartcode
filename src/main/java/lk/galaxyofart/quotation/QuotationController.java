package lk.galaxyofart.quotation;

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
public class QuotationController {

    @Autowired
    private QuotationRepository quotationDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("quotation")
    public ModelAndView quotationPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("4.quotation.html");
        return ui;
    }

    @GetMapping(value = "/quotation/byid", params = { "id" }, produces = "application/json")
    public Quotation getByIdQP(@RequestParam("id") Integer id) {
        return quotationDao.getReferenceById(id);
    }

    @GetMapping(value = "/quotation/alldata", produces = "application/json")
    public List<Quotation> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "quotation");

        if (userPriv.getPrivi_select()) {
            return quotationDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/quotation/delete")
    public String deleteQuotation(@RequestBody Quotation quotation) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "quotation");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        Quotation ext = quotationDao.getReferenceById(quotation.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            quotationDao.delete(quotation);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/quotation/save")
    public String saveQuotation(@RequestBody Quotation quotation) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "quotation");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            quotation.setAddeddatetime(LocalDateTime.now());
            quotation = quotationDao.save(quotation);

            quotation.setQuotationid("QT-" + String.format("%04d", quotation.getId()));
            quotationDao.save(quotation);

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/quotation/update")
    public String updateQuotation(@RequestBody Quotation quotation) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "quotation");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        Quotation ext = quotationDao.getReferenceById(quotation.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            quotation.setUpdatedatetime(LocalDateTime.now());
            quotationDao.save(quotation);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
