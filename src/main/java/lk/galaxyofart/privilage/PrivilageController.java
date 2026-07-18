


package lk.galaxyofart.privilage;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.CommonController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class PrivilageController implements CommonController<Privilage> {

    @Autowired
    private PrivilageRepository privilageDao;

    @Autowired
    private AuthController authcontroller;

    // create mapping for return ui [URL /privilage]
    @RequestMapping("/privilage")
    public ModelAndView privilagePage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView privilageUI = new ModelAndView();
        privilageUI.addObject("loggedusername", authentication.getName());
        privilageUI.setViewName("14.privilage.html");

        return privilageUI;
    }

    // create mapping for get all privilage data [URL /privilage/alldata]
    @GetMapping(value = "/privilage/alldata", produces = "application/json")
    @Override
    public List<Privilage> getAllData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(), "privilage");
        if (userPriv.getPrivi_select()) {
            return privilageDao.findAll();
        } else {
            return new ArrayList<>();
        }

    }

    // creat mapping for save data
    @PostMapping(value = "/privilage/save")
    @Override
    public String saveData(@RequestBody Privilage privilage) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(), "privilage");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance or data duplicate

        // role , module duplicate cheking
        Privilage extPrivilageByRoleModule = privilageDao.getByRoleModule(privilage.getRoles_table_id().getId(), privilage.getModule_table_id().getId());
        if (extPrivilageByRoleModule != null) {
            return "Save Not Completed..! : Privilage Allready Exist ..!";
        }

        // 3.try catch
        try {

            // add auto set values
            privilage.setAddeddatetime(LocalDateTime.now());

            // do operation
            privilageDao.save(privilage);

            // dependanceses check

            return "OK";
        } catch (Exception e) {

            // handle exception
            return "Save Not Completed..!" + e.getMessage();
        }

        
    }

    // create mapping for update data
    @PutMapping(value = "privilage/update")
    @Override
    public String updateData(@RequestBody Privilage privilage) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(), "privilage");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance
        Privilage extPrivilage = privilageDao.getReferenceById(privilage.getId());
        if (extPrivilage == null) {
            return "Update Not Completed..! : Privilage Allready Exist ..!";
        }

        // 3. check data duplication -- oni na refil eke disable krpu nisa

        // 4..try catch
        try {

            // add auto set values
            privilage.setUpdatedatetime(LocalDateTime.now());

            // do operation
            privilageDao.save(privilage);

            // dependanceses check

            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }

    // Create delete mapping
    @DeleteMapping(value = "/privilage/delete")
    @Override
    public String deleteData(@RequestBody Privilage privilage) {

        // 1. need to check log user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(), "privilage");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        // 2. need to chek data existances or data duplicate
        Privilage extPrivilage = privilageDao.getReferenceById(privilage.getId());
        if (extPrivilage == null) {
            return "Delete Not Completed..! :" + privilage.getRoles_table_id().getName() + "is Not Available..!";
        }

        // 3. use try catch
        try {

            // 1.set auto genarate task (if available)

            // 2.do operation
            privilageDao.delete(privilage);

            // 3.dependanceses check

            return "OK";
        } catch (Exception e) {
            return "Delete Not Complete..! : " + e.getMessage();
        }
    }

}
