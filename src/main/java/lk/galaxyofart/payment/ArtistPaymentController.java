package lk.galaxyofart.payment;

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
public class ArtistPaymentController {

    @Autowired
    private ArtistPaymentRepository paymentDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("artistsupplierpayment")
    public ModelAndView paymentPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("8.artistsupplierpayment.html");
        return ui;
    }

    @GetMapping(value = "/artistsupplierpayment/byid", params = { "id" }, produces = "application/json")
    public ArtistPayment getByIdQP(@RequestParam("id") Integer id) {
        return paymentDao.getReferenceById(id);
    }

    @GetMapping(value = "/artistsupplierpayment/alldata", produces = "application/json")
    public List<ArtistPayment> getAllData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "artistsupplierpayment");

        if (userPriv.getPrivi_select()) {
            return paymentDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    @DeleteMapping(value = "/artistsupplierpayment/delete")
    public String deletePayment(@RequestBody ArtistPayment payment) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "artistsupplierpayment");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        ArtistPayment ext = paymentDao.getReferenceById(payment.getId());
        if (ext == null) {
            return "Delete Not Completed..! : Given Record is Not Available..!";
        }

        try {
            paymentDao.delete(payment);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/artistsupplierpayment/save")
    public String savePayment(@RequestBody ArtistPayment payment) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "artistsupplierpayment");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        try {
            payment.setAddeddatetime(LocalDateTime.now());
            payment = paymentDao.save(payment);

            payment.setPayno("PAY-" + String.format("%04d", payment.getId()));
            paymentDao.save(payment);

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/artistsupplierpayment/update")
    public String updatePayment(@RequestBody ArtistPayment payment) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "artistsupplierpayment");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        ArtistPayment ext = paymentDao.getReferenceById(payment.getId());
        if (ext == null) {
            return "Update Not Completed..! : Given Record is Not Available ..!";
        }

        try {
            payment.setUpdatedatetime(LocalDateTime.now());
            paymentDao.save(payment);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
