package lk.galaxyofart.artistsupplierdetails;

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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.privilage.Privilage;

@RestController
public class AsdetailsController {

    @Autowired // creat an object of asdetailsDao
    private AsdetailsRepository asdetailsDao;

    @Autowired
    private AuthController authController;

    // create mapping for return artistsupplier ui URL [/employee]
    @RequestMapping("artistsupplierdetails")
    public ModelAndView artistsupplierdetailsPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // must in
                                                                                                // allcontrollers

        ModelAndView artistsupplierdetailsUI = new ModelAndView();
        artistsupplierdetailsUI.addObject("loggedusername", authentication.getName()); // must in allcontrollers
        artistsupplierdetailsUI.setViewName("1.artistsupplierdetails");

        return artistsupplierdetailsUI;
    }

    @GetMapping(value = "/artistsupplierdetails/artists", produces = "application/json")
    public List<Asdetails> getArtists() {

        return asdetailsDao.findByType("artist");
    }

    @GetMapping(value = "/artistsupplierdetails/suppliers", produces = "application/json")
    public List<Asdetails> getSuppliers() {

        return asdetailsDao.findByType("supplier");
    }

    // Create get mapping for get asdetails object by given id (reqst param)
    // [url/artistsupplierdetails/byid?id= ]
    @GetMapping(value = "/artistsupplierdetails/byid", params = { "id" }, produces = "application/json")
    public Asdetails getAsdetailsIDQp(@RequestParam("id") Integer id) {
        return asdetailsDao.getReferenceById(id);
    }

    // create mapping for get all asdetails data URL [/employee/list]
    @RequestMapping(value = "/artistsupplierdetails/alldata", method = RequestMethod.GET, produces = "application/json")
    public List<Asdetails> getAllartistsupplierdetailsData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "artistsupplierdetails");
        if (userPriv.getPrivi_select()) {
            return asdetailsDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    // create delete mapping for delete givenemployee
    @DeleteMapping(value = "/artistsupplierdetails/delete")
    public String deleteArtistSupplier(@RequestBody Asdetails asdetails) {

        // 1. need to check log user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(),
                "artistsupplierdetails");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        // 2. need to chek data existances or data duplicate
        Asdetails extasdetails = asdetailsDao.getReferenceById(asdetails.getId());
        if (extasdetails == null) {
            return "Delete Not Completed..! :" + asdetails.getName() + "is Not Available..!";
        }

        // 3. use try catch
        try {

            // 1.do operation
            asdetailsDao.delete(asdetails);

            // 2.dependanceses check

            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }

    }

    // create post mapping for save given employee object
    @PostMapping(value = "/artistsupplierdetails/save")
    public String saveArtistSupplier(@RequestBody Asdetails asdetails) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(),
                "artistsupplierdetails");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }
        // 2.need to check data existance or data duplicate

        // nic duplicate cheking
        if ("artist".equalsIgnoreCase(asdetails.getType())) {

            Asdetails extByNic = asdetailsDao.getByNic(asdetails.getNic());

            if (extByNic != null) {
                return "Save Not Completed..! : Given NIC Already Exists ..!";
            }

        }
        // Asdetails extAsdetailsByNic = asdetailsDao.getByNic(asdetails.getNic());
        // if (extAsdetailsByNic != null) {
        // return "Save Not Completed..! : Given NIC Allready Exist ..!";
        // }

        // contact duplicate checking
        Asdetails extAsdetailsByContact = asdetailsDao.getByContact(asdetails.getContact());
        if (extAsdetailsByContact != null) {
            return "Save Not Completed..! : Given Contact No Allready Exist ..!";
        }

        // email duplicate checking
        Asdetails extAsdetailsByEmail = asdetailsDao.getByEmail(asdetails.getEmail());
        if (extAsdetailsByEmail != null) {
            return "Save Not Completed..! : Given Email Allready Exist ..!";
        }

        // brn duplicate checking
        if ("supplier".equalsIgnoreCase(asdetails.getType())) {

            Asdetails extByBrn = asdetailsDao.getByBrn(asdetails.getBrn());

            if (extByBrn != null) {
                return "Save Not Completed..! : Given BRN Already Exists ..!";
            }

        }
        // Asdetails extAsdetailsByBrn = asdetailsDao.getByBrn(asdetails.getBrn());
        // if (extAsdetailsByBrn != null) {
        // return "Save Not Completed..! : Given BRN Allready Exist ..!";
        // }

        // 3.try catch
        try {

            // add auto set values
            asdetails.setAddeddatetime(LocalDateTime.now());

            // do operation
            asdetailsDao.save(asdetails);

            // dependanceses check

            return "OK";
        } catch (Exception e) {
            // handle exception
            return "Save Not Completed..!" + asdetails.getName();
        }

    }

    // create mapping for update employee record
    @PutMapping(value = "/artistsupplierdetails/update")
    public String updateAsdetails(@RequestBody Asdetails asdetails) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(),
                "artistsupplierdetails");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance
        // Asdetails extAsdetails = asdetailsDao.getReferenceById(asdetails.getId());
        // if (extAsdetails == null) {
        // return "Update Not Completed..! :" + asdetails.getName() + " is Not Available
        // ..!";
        // }

        // 3.check duplicate
        // Asdetails extAsdetailsByNic = asdetailsDao.getByNic(asdetails.getNic());
        // already nic thiynwa . thamma or wena knk. thnmanm ok. wena knk nm errro mg
        // enwa
        // if (extAsdetailsByNic != null && extAsdetailsByNic.getId() !=
        // extAsdetails.getId()) {
        // return "Save Not Completed..! : Given NIC Allready Exist ..!";
        // }

        // Contact duplicate
        Asdetails extByContact = asdetailsDao.getByContact(asdetails.getContact());
        if (extByContact != null &&
                !extByContact.getId().equals(asdetails.getId())) {

            return "Contact Number Already Exists..!";
        }

        // Email duplicate
        Asdetails extByEmail = asdetailsDao.getByEmail(asdetails.getEmail());
        if (extByEmail != null &&
                !extByEmail.getId().equals(asdetails.getId())) {

            return "Email Already Exists..!";
        }

        // Artist validation
        if ("artist".equalsIgnoreCase(asdetails.getType())) {

            Asdetails extByNic = asdetailsDao.getByNic(asdetails.getNic());

            if (extByNic != null &&
                    !extByNic.getId().equals(asdetails.getId())) {

                return "NIC Already Exists..!";
            }

        }

        // Supplier validation
        if ("supplier".equalsIgnoreCase(asdetails.getType())) {

            Asdetails extByBrn = asdetailsDao.getByBrn(asdetails.getBrn());

            if (extByBrn != null &&
                    !extByBrn.getId().equals(asdetails.getId())) {

                return "BRN Already Exists..!";
            }

        }

        // 4.try catch
        try {
            // add auto set values
            asdetails.setUpdatedatetime(LocalDateTime.now());

            // do operation
            asdetailsDao.save(asdetails);

            // dependanceses check
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + asdetails.getName();
        }

    }
}
