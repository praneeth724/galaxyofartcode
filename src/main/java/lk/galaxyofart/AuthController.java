package lk.galaxyofart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.galaxyofart.privilage.Privilage;
import lk.galaxyofart.privilage.PrivilageRepository;

@RestController
public class AuthController {

    @Autowired
    private PrivilageRepository privilageRepository;

    @GetMapping(value = "/userprivilagebymodule", params = { "modulename" })
    public Privilage getPrivilageByModule(@RequestParam("modulename") String modulename) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilageByUserAndModule(auth.getName(), modulename);
    }

    public Privilage getPrivilageByUserAndModule(String username, String modulename) {

        Privilage privilage = new Privilage();
        if (username.equalsIgnoreCase("admin")) {
            privilage.setPrivi_select(Boolean.TRUE);
            privilage.setPrivi_insert(Boolean.TRUE);
            privilage.setPrivi_update(Boolean.TRUE);
            privilage.setPrivi_delete(Boolean.TRUE);

        } else {
            PrivilageRepository.PrivilegeAggregate agg = privilageRepository.getPrivilageByUserAndModule(username, modulename);
            privilage.setPrivi_select(agg != null && agg.getPri_select() != null && agg.getPri_select() != 0);
            privilage.setPrivi_insert(agg != null && agg.getPri_insert() != null && agg.getPri_insert() != 0);
            privilage.setPrivi_update(agg != null && agg.getPri_update() != null && agg.getPri_update() != 0);
            privilage.setPrivi_delete(agg != null && agg.getPri_delete() != null && agg.getPri_delete() != 0);

        }

        return privilage;
    }
}
