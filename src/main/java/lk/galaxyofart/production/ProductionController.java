package lk.galaxyofart.production;

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
public class ProductionController {

    @Autowired
    private ProductionRepository productionDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("production")
    public ModelAndView productionPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("10.production.html");
        return ui;
    }

    @RequestMapping("productionview")
    public ModelAndView productionViewPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("11.productionView.html");
        return ui;
    }

    @RequestMapping("productionview/details")
    public ModelAndView productionJobDetailsPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("11a.productionJobDetails.html");
        return ui;
    }

    @GetMapping(value = "/production/byid", params = { "id" }, produces = "application/json")
    public Production getByIdQP(@RequestParam("id") Integer id) {
        return productionDao.getReferenceById(id);
    }

    @GetMapping(value = "/production/alldata", produces = "application/json")
    public List<Production> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "production");

        if (userPriv.getPrivi_select()) {
            return productionDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    // read-only feed for the production view/report page
    @GetMapping(value = "/productionview/alldata", produces = "application/json")
    public List<Production> getViewData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "production");

        if (userPriv.getPrivi_select()) {
            return productionDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/production/delete")
    public String deleteProduction(@RequestBody Production production) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "production");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        Production ext = productionDao.getReferenceById(production.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            productionDao.delete(production);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/production/save")
    public String saveProduction(@RequestBody Production production) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "production");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            production.setAddeddatetime(LocalDateTime.now());
            production = productionDao.save(production);

            production.setJobid("JOB-" + String.format("%04d", production.getId()));
            productionDao.save(production);

            return "OK:" + production.getId();
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/production/update")
    public String updateProduction(@RequestBody Production production) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "production");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        Production ext = productionDao.getReferenceById(production.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            production.setUpdatedatetime(LocalDateTime.now());
            productionDao.save(production);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
